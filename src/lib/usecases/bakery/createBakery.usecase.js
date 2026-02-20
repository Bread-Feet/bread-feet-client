import { uploadMainPhoto } from "../../api/imgUpload";
import { submitBakeryForm } from "../../api/bakery-form";

function validateBakeryBody(body) {
  if (!body?.name?.trim()) throw new Error("빵집 이름은 필수입니다.");

  const a = body?.address;
  if (!a?.lotNumber?.trim()) throw new Error("지번 주소는 필수입니다.");
  if (!a?.roadAddress?.trim()) throw new Error("도로명 주소는 필수입니다.");

  if (!body?.imageUrl?.trim()) throw new Error("대표 사진은 필수입니다.");

  if (!body?.phoneNumber?.trim()) throw new Error("전화번호는 필수입니다.");
  if (!body?.businessHours?.trim()) throw new Error("영업 시간은 필수입니다.");

  if (!body?.bestBread?.trim()) throw new Error("대표 빵은 필수입니다.");
}

export async function createBakeryUseCase({ draftBody, files }) {
  const imageUrl = files.mainPhoto
    ? await uploadMainPhoto({ file: files.mainPhoto })
    : "";

  const menuPhotos = Array.isArray(files?.menuPhotos) ? files.menuPhotos : [];
  const menus = Array.isArray(draftBody?.menus) ? draftBody.menus : [];

  const uploadedMenus = await Promise.all(
    menus.map(async (menu, idx) => {
      const file = menuPhotos[idx];
      if (!file) return menu;

      const thumbnailUrl = await uploadMainPhoto({ file });
      return { ...menu, thumbnailUrl };
    }),
  );

  const finalBody = { ...draftBody, imageUrl, menus: uploadedMenus };

  validateBakeryBody(finalBody);

  return await submitBakeryForm(finalBody);
}
