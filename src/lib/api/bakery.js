import { apiClient } from "../api-client";

export async function fetchBakeries({ keyword, cursorId, size = 10 } = {}) {
  const params = new URLSearchParams({ size });
  if (keyword) params.set("keyword", keyword);
  if (cursorId != null) params.set("cursorId", String(cursorId));
  return apiClient.get(`/api/v1/bakeries?${params}`);
}

export async function fetchMyBakeries({ keyword, cursorId, size = 10 } = {}) {
  const params = new URLSearchParams({ size });
  if (keyword) params.set("keyword", keyword);
  if (cursorId != null) params.set("cursorId", String(cursorId));
  return apiClient.get(`/api/v1/bakeries?${params}`);
}
