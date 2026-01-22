import { getApiUrl, AUTH_CONFIG } from "../config/env";

const STORAGE_KEY_LAST_REFRESH = "bread_feet_last_token_refresh"; // 마지막 refresh 시각
const STORAGE_KEY_REFRESH_LOCK = "bread_feet_refresh_lock";
const LOCK_TIMEOUT = 10000;

// private mode/SSR에서 오류나지 않게 방지
// window 없으면 null
// localStorage 접근 중 에러 발생시 catch로 실패 처리
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

// 프론트에서 api 호출시 발생하는 문제를 해결하고자
// 1. 여러 컴포넌트/요청에서 동시에 api 접근
// 2. access token 만료(만료 직전)로 다수가 동시에 /auth/refresh 호출
class AuthService {
  constructor() {
    // 지금 refresh 요청이 진행 중이면, 그 Promise를 저장해두고 공유
    // 같은 탭에서 401이 동시에 여러개 떠도 refresh 호출이 1번만 발생
    this.refreshPromise = null;
  }

  getLastRefreshTime() {
    const stored = storage.getItem(STORAGE_KEY_LAST_REFRESH);
    return stored ? parseInt(stored, 10) : 0; // 마지막으로 refresh된 시간이 있으면 문자열을 숫자로 변환, 없으면 0 반환
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

    // lock이 없거나 오래되어서 timeout이 지났으면 true
    storage.setItem(STORAGE_KEY_REFRESH_LOCK, Date.now().toString());
    return true;
  }

  releaseLock() {
    storage.removeItem(STORAGE_KEY_REFRESH_LOCK);
  }

  // 선제 refresh가 필요한지
  shouldRefreshPreemptively() {
    const lastRefresh = this.getLastRefreshTime();
    if (lastRefresh === 0) return false; // 마지막 refresh가 없다면 false(선제 refresh X)
    return Date.now() - lastRefresh > AUTH_CONFIG.TOKEN_REFRESH_THRESHOLD_MS; // 남은 시간이 AUTH_CONFIG.TOKEN_REFRESH_THRESHOLD_MS보다 크면 true
  }

  async refreshTokens() {
    // 단일 탭 중복 방지
    // 이미 refresh 중이면,
    // 새 refresh 요청 만들지 않고 기존 Promise 반환(첫 호출이 만든 Promise를 나머지 호출이 공유)
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // 멀티탭 중복 방지
    // lock 못잡으면 잠깐 기다리고 true 반환(다른 탭이 refresh해서 쿠키가 갱신될 거니까 그냥 성공했다고 판단하고 넘어감)
    if (!this.acquireLock()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return true;
    }

    // 실제 refresh 호출 & 상태 업데이트
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
        this.refreshPromise = null; // 포인터 비우기
      }
    })();

    return this.refreshPromise; // Promise 객체 반환
  }

  // login 성공 표시
  markLoginSuccess() {
    this.setLastRefreshTime();
  }

  // logout/인증 reset 시점 등에서 refresh 관련 상태 초기화
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

    // FormData 형식일 경우에는 Content-type을 직접 세팅하면 안되므로 확인 필요
    const isFormData = options.body instanceof FormData;

    // 공통 options
    const defaultOptions = {
      credentials: "include",
      headers: isFormData
        ? { ...options.headers } // true
        : {
            // false
            "Content-Type": "application/json",
            ...options.headers, // 사용자가 추가로 준 options
          },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      // response code가 401인 경우(유저 정보 가져오지 못함)
      // retryOnUnauthorized는 재시도를 1번만 하기 위함
      if (response.status === 401 && retryOnUnauthorized) {
        const refreshed = await authService.refreshTokens(); // token refresh

        // token refresh 성공
        if (refreshed) {
          return this.request(endpoint, options, false); // 재시도(retryOnUnauthorized를 false로 변경)
        }

        // token refresh 실패
        if (
          typeof window !== "undefined" && // 브라우저에서 실행 중인지 확인
          !window.location.pathname.startsWith("/login") // 이미 login 페이지에 있을때 login으로 보내면 무한 루프 발생
        ) {
          const returnUrl = window.location.pathname + window.location.search;
          window.location.href = `/login?returnUrl=${encodeURIComponent(returnUrl)}`; // login 페이지로 이동
        }
      }

      // 401이 아닌 다른 코드거나, 재시도(1번) 후에도 실패시
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

    // 다른 code인데도 body 없으면 undefined return
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
