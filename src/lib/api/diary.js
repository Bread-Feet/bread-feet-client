import { apiClient } from "../api-client";

export async function fetchDiaries({ cursor, size = 10 } = {}) {
  const params = new URLSearchParams({ size });
  if (cursor != null) params.set("cursor", String(cursor));
  return apiClient.get(`/api/v1/diaries?${params}`);
}

export async function createDiary(body) {
  return apiClient.post("/api/v1/diaries", body);
}

export async function fetchDiaryDetail(diaryId) {
  if (diaryId == null) {
    throw new TypeError("fetchDiaryDetail requires a diaryId");
  }

  const normalizedId = String(diaryId).trim();
  if (!normalizedId) {
    throw new TypeError("fetchDiaryDetail requires a non-empty diaryId");
  }

  const encodedId = encodeURIComponent(normalizedId);
  return apiClient.get(`/api/v1/diaries/${encodedId}`);
}
