import { apiClient } from "../api-client";

export async function fetchDiaries({ cursor, size = 10 } = {}) {
  const params = new URLSearchParams({ size });
  if (cursor != null) params.set("cursor", String(cursor));
  return apiClient.get(`/api/v1/diaries?${params}`);
}
