import { apiClient } from "../api-client";

export async function fetchReviews({ bakeryId, cursor, size = 10 } = {}) {
  const params = new URLSearchParams({ size });
  if (cursor != null) params.set("cursor", String(cursor));
  return apiClient.get(`/api/v1/bakery/${bakeryId}/review?${params}`);
}

export async function createReview({ bakeryId, content, rating, reviewPictureUrls = [] }) {
  return apiClient.post("/api/v1/bakery/reviews", {
    bakeryId,
    content,
    rating,
    reviewPictureUrls,
  });
}

export async function updateReview({ reviewId, content, rating }) {
  return apiClient.put(`/api/v1/bakery/reviews/${reviewId}`, { content, rating });
}

export async function deleteReview({ reviewId }) {
  return apiClient.delete(`/api/v1/bakery/reviews/${reviewId}`);
}

export async function createReviewLike({ reviewId }) {
  return apiClient.post("/api/v1/bakery/reviews/likes", { reviewId });
}

export async function deleteReviewLike({ reviewId }) {
  return apiClient.delete(`/api/v1/bakery/reviews/${reviewId}/likes`);
}
