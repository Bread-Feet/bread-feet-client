import { apiClient } from "../api-client";

export async function fetchBakeries({ keyword, cursor, size = 10, sort, isBookmark } = {}) {
  const params = new URLSearchParams({ size });
  if (keyword) params.set("keyword", keyword);
  if (cursor != null) params.set("cursor", String(cursor));
  if (sort) params.set("sort", sort);
  if (isBookmark) params.set("isBookmark", true);
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

export async function deleteBakery(bakeryId) {
  return apiClient.delete(`/api/v1/bakeries/${bakeryId}`);
}

export async function fetchNearbyBakeries({ x, y }) {
  const params = new URLSearchParams({ x: String(x), y: String(y) });
  return apiClient.get(`/api/v1/bakeries/nearby?${params}`);
}

export async function fetchAllMapBakeries() {
  const all = [];
  let cursor = null;
  const size = 100;

  do {
    const data = await fetchBakeries({ cursor, size });
    const content = data?.content ?? [];
    all.push(...content);
    if (content.length < size) break;
    cursor = content[content.length - 1]?.cursorId ?? null;
  } while (cursor != null);

  return all;
}