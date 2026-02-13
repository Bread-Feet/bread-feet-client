import { getApiUrl, AUTH_CONFIG } from "../config/env";
import { getAccessToken } from "./token-storage.js";

const STORAGE_KEY_LAST_REFRESH = "bread_feet_last_token_refresh"; // ë§ˆì?ë§?refresh ?œê°
const STORAGE_KEY_REFRESH_LOCK = "bread_feet_refresh_lock";
const LOCK_TIMEOUT = 10000;

// private mode/SSR?ì„œ ?¤ë¥˜?˜ì? ?Šê²Œ ë°©ì?
// window ?†ìœ¼ë©?null
// localStorage ?‘ê·¼ ì¤??ëŸ¬ ë°œìƒ??catchë¡??¤íŒ¨ ì²˜ë¦¬
function safeLocalStorage() {
  return {
    getItem(key) {
      try {
        if (typeof window == "undefined") return null;
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem(key, value) {
      try {
        if (typeof window === "undefined") return;
        localStorage.setItem(key, value);
      } catch {}
    },
    removeItem(key) {
      try {
        if (typeof window === "undefined") return;
        localStorage.removeItem(key);
      } catch {}
    },
  };
}

const storage = safeLocalStorage();

// ?„ë¡ ?¸ì—??api ?¸ì¶œ??ë°œìƒ?˜ëŠ” ë¬¸ì œë¥??´ê²°?˜ê³ ??
// 1. ?¬ëŸ¬ ì»´í¬?ŒíŠ¸/?”ì²­?ì„œ ?™ì‹œ??api ?‘ê·¼
// 2. access token ë§Œë£Œ(ë§Œë£Œ ì§ì „)ë¡??¤ìˆ˜ê°€ ?™ì‹œ??/auth/refresh ?¸ì¶œ
class AuthService {
  constructor() {
    // ì§€ê¸?refresh ?”ì²­??ì§„í–‰ ì¤‘ì´ë©? ê·?Promiseë¥??€?¥í•´?ê³  ê³µìœ 
    // ê°™ì? ??—??401???™ì‹œ???¬ëŸ¬ê°?? ë„ refresh ?¸ì¶œ??1ë²ˆë§Œ ë°œìƒ
    this.refreshPromise = null;
  }

  getLastRefreshTime() {
    const stored = storage.getItem(STORAGE_KEY_LAST_REFRESH);
    return stored ? parseInt(stored, 10) : 0; // ë§ˆì?ë§‰ìœ¼ë¡?refresh???œê°„???ˆìœ¼ë©?ë¬¸ì?´ì„ ?«ìë¡?ë³€?? ?†ìœ¼ë©?0 ë°˜í™˜
  }

  setLastRefreshTime() {
    storage.setItem(STORAGE_KEY_LAST_REFRESH, Date.now().toString());
  }

  // lock ?ë“(?œë„)
  acquireLock() {
    const lockData = storage.getItem(STORAGE_KEY_REFRESH_LOCK);

    if (lockData) {
      const lockTime = parseInt(lockData, 10);
      if (Date.now() - lockTime < LOCK_TIMEOUT) {
        // ?„êµ°ê°€ lock(? íš¨)???¡ê³  ?ˆìœ¼ë©?false
        return false;
      }
    }

    // lock???†ê±°???¤ë˜?˜ì–´??timeout??ì§€?¬ìœ¼ë©?true
    storage.setItem(STORAGE_KEY_REFRESH_LOCK, Date.now().toString());
    return true;
  }

  releaseLock() {
    storage.removeItem(STORAGE_KEY_REFRESH_LOCK);
  }

  // ? ì œ refreshê°€ ?„ìš”?œì?
  shouldRefreshPreemptively() {
    const lastRefresh = this.getLastRefreshTime();
    if (lastRefresh === 0) return false; // ë§ˆì?ë§?refreshê°€ ?†ë‹¤ë©?false(? ì œ refresh X)
    return Date.now() - lastRefresh > AUTH_CONFIG.TOKEN_REFRESH_THRESHOLD_MS; // ?¨ì? ?œê°„??AUTH_CONFIG.TOKEN_REFRESH_THRESHOLD_MSë³´ë‹¤ ?¬ë©´ true
  }

  async refreshTokens() {
    // ?¨ì¼ ??ì¤‘ë³µ ë°©ì?
    // ?´ë? refresh ì¤‘ì´ë©?
    // ??refresh ?”ì²­ ë§Œë“¤ì§€ ?Šê³  ê¸°ì¡´ Promise ë°˜í™˜(ì²??¸ì¶œ??ë§Œë“  Promiseë¥??˜ë¨¸ì§€ ?¸ì¶œ??ê³µìœ )
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // ë©€?°íƒ­ ì¤‘ë³µ ë°©ì?
    // lock ëª»ì¡?¼ë©´ ? ê¹ ê¸°ë‹¤ë¦¬ê³  true ë°˜í™˜(?¤ë¥¸ ??´ refresh?´ì„œ ì¿ í‚¤ê°€ ê°±ì‹ ??ê±°ë‹ˆê¹?ê·¸ëƒ¥ ?±ê³µ?ˆë‹¤ê³??ë‹¨?˜ê³  ?˜ì–´ê°?
    if (!this.acquireLock()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return true;
    }

    // ?¤ì œ refresh ?¸ì¶œ & ?íƒœ ?…ë°?´íŠ¸
    this.refreshPromise = (async () => {
      try {
        //url
        const response = await fetch(`${getApiUrl()}/api/v1/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          this.setLastRefreshTime();
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        this.releaseLock();
        this.refreshPromise = null; // ?¬ì¸??ë¹„ìš°ê¸?
      }
    })();

    return this.refreshPromise; // Promise ê°ì²´ ë°˜í™˜
  }

  // login ?±ê³µ ?œì‹œ
  markLoginSuccess() {
    this.setLastRefreshTime();
  }

  // logout/?¸ì¦ reset ?œì  ?±ì—??refresh ê´€???íƒœ ì´ˆê¸°??
  clearRefreshData() {
    storage.removeItem(STORAGE_KEY_LAST_REFRESH);
    storage.removeItem(STORAGE_KEY_REFRESH_LOCK);
  }
}

const authService = new AuthService();

class ApiClient {
  getBaseURL() {
    return getApiUrl();
  }

  async request(endpoint, options = {}, retryOnUnauthorized = true) {
    const url = `${this.getBaseURL()}${endpoint}`;

    // FormData ?•ì‹??ê²½ìš°?ëŠ” Content-type??ì§ì ‘ ?¸íŒ…?˜ë©´ ?ˆë˜ë¯€ë¡??•ì¸ ?„ìš”
    const isFormData = options.body instanceof FormData;

    // api ?¸ì¶œ??? í°???ë™?¼ë¡œ ?¬í•¨
    const providedHeaders = options.headers ? { ...options.headers } : {};

    if (!providedHeaders.Authorization && !providedHeaders.authorization) {
      const accessToken = await getAccessToken();
      if (accessToken) {
        providedHeaders.Authorization = `Bearer ${accessToken}`;
      }
    }

    // ê³µí†µ options
    const defaultOptions = {
      credentials: "include",
      headers: isFormData
        ? { ...providedHeaders } // true
        : {
            // false
            "Content-Type": "application/json",
            ...providedHeaders, // ?¬ìš©?ê? ì¶”ê?ë¡?ì¤€ options
          },
    };

    const mergedHeaders = {
      ...defaultOptions.headers,
      ...(options.headers ? options.headers : {}),
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: mergedHeaders,
    });

    if (!response.ok) {
      // response codeê°€ 401??ê²½ìš°(? ì? ?•ë³´ ê°€?¸ì˜¤ì§€ ëª»í•¨)
      // retryOnUnauthorized???¬ì‹œ?„ë? 1ë²ˆë§Œ ?˜ê¸° ?„í•¨
      if (response.status === 401 && retryOnUnauthorized) {
        // Access-token only?¼ì„œ refresh token ë¶€ë¶„ì? ?? œ
        /*
        const refreshed = await authService.refreshTokens(); // token refresh

        // token refresh ?±ê³µ
        if (refreshed) {
          return this.request(endpoint, options, false); // ?¬ì‹œ??retryOnUnauthorizedë¥?falseë¡?ë³€ê²?
        }
        */

        // token refresh ?¤íŒ¨
        if (
          typeof window !== "undefined" && // ë¸Œë¼?°ì??ì„œ ?¤í–‰ ì¤‘ì¸ì§€ ?•ì¸
          !window.location.pathname.startsWith("/login") // ?´ë? login ?˜ì´ì§€???ˆì„??login?¼ë¡œ ë³´ë‚´ë©?ë¬´í•œ ë£¨í”„ ë°œìƒ
        ) {
          const returnUrl = window.location.pathname + window.location.search;
          window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`; // login ?˜ì´ì§€ë¡??´ë™
          return;
        }
      }

      // 401???„ë‹Œ ?¤ë¥¸ ì½”ë“œê±°ë‚˜, ?¬ì‹œ??1ë²? ?„ì—???¤íŒ¨??
      const errorData = await response.json().catch(() => ({
        message: "An error occurred",
      }));

      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    // 204/205??bodyê°€ ?†ìœ¼ë¯€ë¡?undefined return
    if (response.status === 204 || response.status === 205) {
      return undefined;
    }

    // ?¤ë¥¸ code?¸ë°??body ?†ìœ¼ë©?undefined return
    const contentLength = response.headers.get("content-length");
    if (contentLength === "0") {
      return undefined;
    }

    const data = await response.json();

    if (data && typeof data === "object" && "data" in data) {
      return data.data;
    }

    return data;
  }

  async get(endpoint, options) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  async post(endpoint, data, options) {
    const body = data instanceof FormData ? data : JSON.stringify(data);

    return this.request(endpoint, {
      ...options,
      method: "POST",
      body,
    });
  }

  async put(endpoint, data, options) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data, options) {
    return this.request(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();

export async function refreshTokensIfNeeded() {
  try {
    if (authService.shouldRefreshPreemptively()) {
      await authService.refreshTokens();
    }
  } catch {}
}

export function markLoginSuccess() {
  authService.markLoginSuccess();
}

export function clearAuthData() {
  authService.clearRefreshData();
}


