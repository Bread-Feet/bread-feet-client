import { apiClient } from "../api-client";

export async function submitBakeryForm(body) {
  return apiClient.post("/api/v1/bakeries", body);
}
