import { getApiUrl, AUTH_CONFIG } from "../config/env";
import { getAccessToken } from "./token-storage.js";
import axios from "axios";

export const uploadApi = axios.create({
  baseURL: getApiUrl(),
  withCredentials: false,
});

uploadApi.interceptors.request.use(async (config) => {
  if (!config.headers?.Authorization && !config.headers?.authorization) {
    const token = await getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const STORAGE_KEY_LAST_REFRESH = "bread_feet_last_token_refresh"; // 마지막 refresh 시각
const STORAGE_KEY_REFRESH_LOCK = "bread_feet_refresh_lock";
const LOCK_TIMEOUT = 10000;

// private mode/SSR에서 오류가 나지 않게 방어
// window 없으면 null
// localStorage 접근 시 에러 발생하면 catch로 실패 처리
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

// 토큰 갱신 시 API 호출이 중복으로 발생하는 문제를 해결하고 싶음
// 1) 여러 컴포넌트/요청에서 동시에 API 접근
// 2) access token 만료(만료 직전)로 인해 동시에 /auth/refresh 호출
class AuthService {
  constructor() {
    // 현재 refresh 요청이 진행 중이면 Promise를 저장해두고 공유
    // 같은 시점에 401이 여러 번 떠도 refresh 호출은 1번만 발생
    this.refreshPromise = null;
  }

  getLastRefreshTime() {
    const stored = storage.getItem(STORAGE_KEY_LAST_REFRESH); // 마지막으로 refresh한 시간을 문자열로 저장했으므로 숫자로 변환, 없으면 0 반환
    return stored ? parseInt(stored, 10) : 0;
  }

  setLastRefreshTime() {
    storage.setItem(STORAGE_KEY_LAST_REFRESH, Date.now().toString());
  }

  // lock 획득(시도)
  acquireLock() {
    const lockData = storage.getItem(STORAGE_KEY_REFRESH_LOCK);

    if (lockData) {
      const lockTime = parseInt(lockData, 10);
      if (Date.now() - lockTime < LOCK_TIMEOUT) {
        // 누군가 lock(유효)을 잡고 있으면 false
        return false;
      }
    }

    // lock이 없거나 오래되어 timeout이 지났으면 true
    storage.setItem(STORAGE_KEY_REFRESH_LOCK, Date.now().toString());
    return true;
  }

  releaseLock() {
    storage.removeItem(STORAGE_KEY_REFRESH_LOCK);
  }

  // 언제 refresh가 필요한가?
  shouldRefreshPreemptively() {
    const lastRefresh = this.getLastRefreshTime();
    if (lastRefresh === 0) return false; // 아직 refresh한 적이 없다면 false(굳이 refresh X)
    // 지난 시간이 AUTH_CONFIG.TOKEN_REFRESH_THRESHOLD_MS보다 크면 true
    return Date.now() - lastRefresh > AUTH_CONFIG.TOKEN_REFRESH_THRESHOLD_MS;
  }

  async refreshTokens() {
    // 단일 탭 중복 방지:
    // 이미 refresh 중이면 새 요청을 만들지 않고 기존 Promise를 반환(공유)
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // 멀티 탭 중복 방지:
    // lock을 못 잡으면 잠깐 기다렸다가 true 반환(다른 탭에서 refresh해서 쿠키가 갱신됐다고 보고 일단 성공으로 간주)
    if (!this.acquireLock()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return true;
    }

    // 실제 refresh 호출 & 상태 업데이트
    this.refreshPromise = (async () => {
      try {
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
        this.refreshPromise = null; // 끝나면 비움
      }
    })();

    return this.refreshPromise; // Promise 객체 반환
  }

  // login 성공 시
  markLoginSuccess() {
    this.setLastRefreshTime();
  }

  // logout/인증 reset 시점 등에 refresh 관련 상태 초기화
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

    // FormData 형식인 경우에는 Content-Type을 직접 세팅하면 안 되므로 확인 필요
    const isFormData = options.body instanceof FormData;

    // API 호출 시 토큰을 자동으로 추가
    const providedHeaders = options.headers ? { ...options.headers } : {};

    if (!providedHeaders.Authorization && !providedHeaders.authorization) {
      const accessToken = await getAccessToken();
      if (accessToken) {
        providedHeaders.Authorization = `Bearer ${accessToken}`;
      }
    }

    // 공통 options
    const defaultOptions = {
      credentials: "include",
      headers: isFormData
        ? { ...providedHeaders }
        : {
            "Content-Type": "application/json",
            ...providedHeaders, // 사용자가 추가로 준 options
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
      // response code가 401인 경우(정보를 가져오지 못함)
      // retryOnUnauthorized: refresh 후 재시도는 1번만 하도록 제한
      if (response.status === 401 && retryOnUnauthorized) {
        // Access-token only라서 refresh token 부분은 일단 주석
        /*
        const refreshed = await authService.refreshTokens(); // token refresh

        if (refreshed) {
          return this.request(endpoint, options, false); // 재시도 시 retryOnUnauthorized를 false로 변경
        }
        */

        // token refresh 실패
        if (
          typeof window !== "undefined" && // 브라우저에서 실행 중인지 확인
          !window.location.pathname.startsWith("/login") // 이미 login 페이지면 무한 루프 방지
        ) {
          const returnUrl = window.location.pathname + window.location.search;
          window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`; // login 페이지로 이동
          return;
        }
      }

      // 401이 아닌 다른 코드거나, 재시도 1회 후에도 실패한 경우
      const errorData = await response.json().catch(() => ({
        message: "An error occurred",
      }));

      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    // 204/205는 body가 없으므로 undefined return
    if (response.status === 204 || response.status === 205) {
      return undefined;
    }

    // 다른 코드여도 body가 없으면 undefined return
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
