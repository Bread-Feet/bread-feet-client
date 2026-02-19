import { uploadApi } from "../api-client";

export async function uploadMainPhoto({ file }) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await uploadApi.post("/s3", formData, {
      params: { folderName: "bakery" },
    });
    return response.data.data.publicUrl;
  } catch (error) {
    const msg =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "업로드 실패";
    throw new Error(typeof msg === "string" ? msg : "업로드 실패");
  }
}
