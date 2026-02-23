import { apiClient } from "../api-client";

export async function fetchBakeries({ keyword, cursor, size = 10, sort } = {}) {
  const params = new URLSearchParams({ size });
  if (keyword) params.set("keyword", keyword);
  if (cursor != null) params.set("cursor", String(cursor));
  if (sort) params.set("sort", sort);
  return apiClient.get(`/api/v1/bakeries?${params}`);
}

export async function fetchMyBakeries({
  keyword,
  cursor,
  size = 10,
  sort,
} = {}) {
  const params = new URLSearchParams({ size });
  if (keyword) params.set("keyword", keyword);
  if (cursor != null) params.set("cursor", String(cursor));
  if (sort) params.set("sort", sort);
  params.set("isMyBakery", true);
  return apiClient.get(`/api/v1/bakeries?${params}`);
}

export async function fetchBakery(bakeryId) {
  return apiClient.get(`/api/v1/bakeries/${bakeryId}`);
}

export async function fetchRandomBakeries(size = 4) {
  return apiClient.get(`/api/v1/bakeries/random?size=${size}`);
}
