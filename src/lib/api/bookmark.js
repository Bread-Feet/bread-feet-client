import { apiClient } from "../api-client";

export async function fetchBookmark({ bakeryId }) {
  return apiClient.get(`/api/v1/bookmarks/${bakeryId}`);
}

export async function createBookmark({ bakeryId }) {
  return apiClient.post(`/api/v1/bookmarks/${bakeryId}`);
}

export async function deleteBookmark({ bakeryId }) {
  return apiClient.delete(`/api/v1/bookmarks/${bakeryId}`);
}
