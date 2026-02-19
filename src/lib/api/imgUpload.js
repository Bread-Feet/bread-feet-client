import { uploadApi } from "../api-client";

export async function uploadMainPhoto({ file }) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await uploadApi.post("/s3", formData, {
      params: { folderName: "bakery" },
    });
    const publicUrl = response.data?.data?.publicUrl;
    if (!publicUrl) throw new Error("업로드에 실패했습니다. 다시 시도해주세요.");
    return publicUrl;
  } catch (error) {
    const msg =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "업로드 실패";
    throw new Error(typeof msg === "string" ? msg : "업로드 실패");
  }
}
