import { apiClient } from "../api-client";

export async function fetchBakeries({ keyword, cursor, size = 10 } = {}) {
  const params = new URLSearchParams({ size });
  if (keyword) params.set("keyword", keyword);
  if (cursor != null) params.set("cursor", String(cursor));
  return apiClient.get(`/api/v1/bakeries?${params}`);
}

export async function fetchMyBakeries({ keyword, cursor, size = 10 } = {}) {
  const params = new URLSearchParams({ size });
  if (keyword) params.set("keyword", keyword);
  if (cursor != null) params.set("cursor", String(cursor));
  return apiClient.get(`/api/v1/bakeries/my?${params}`);
}
