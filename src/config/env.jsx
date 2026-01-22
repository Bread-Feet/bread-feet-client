export function getClientApiUrl() {
  return import.meta.env.VITE_API_URL || "http://localhost:30000";
}

export function getApiUrl() {
  return getClientApiUrl();
}

// token 만료/갱신 시간 설정
// 설정 없을시 기본값 사용
export const AUTH_CONFIG = {
  // 7일
  REFRESH_TOKEN_MAX_AGE_MS: parseInt(
    import.meta.env.VITE_REFRESH_TOKEN_MAX_AGE_MS || "604800000",
    10,
  ),
  // 45분
  TOKEN_REFRESH_THRESHOLD_MS: parseInt(
    import.meta.env.VITE_TOKEN_REFRESH_THRESHOLD_MS || "2700000",
    10,
  ),
};
