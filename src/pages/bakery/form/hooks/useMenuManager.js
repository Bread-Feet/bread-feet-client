const logoImg = "/menu_example_img.svg";

import { useState } from "react";

export default function useMenuManager() {
  const [draftMenuPhotoPreview, setDraftMenuPhotoPreview] = useState(null);
  const [menus, setMenus] = useState([
    { id: 1, name: "소금빵", price: 2800, isMain: true, photoPreview: logoImg },
    {
      id: 2,
      name: "크림빵",
      price: 4500,
      isMain: false,
      photoPreview: logoImg,
    },
  ]);

  // 메뉴 추가용 임시 상태
  const [newMenu, setNewMenu] = useState({
    name: "",
    price: "",
    photoPreview: null,
  });

  const handleDraftMenuPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있어요.");
      e.target.value = "";
      return;
    }

    // 이전 미리보기 url 해제
    setDraftMenuPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    setNewMenu((p) => ({ ...p, photoPreview: URL.createObjectURL(file) }));
  };

  const addMenu = () => {
    if (!newMenu.name.trim()) return;
    const priceNum = Number(newMenu.price);
    setMenus((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newMenu.name.trim(),
        price: Number.isFinite(priceNum) ? priceNum : 0,
        isMain: prev.length === 0,
        photoPreview: newMenu.photoPreview,
      },
    ]);

    setDraftMenuPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });

    setNewMenu({ name: "", price: "", photoPreview: null });
  };

  const removeMenu = (id) => {
    setMenus((prev) => {
      const target = prev.find((m) => m.id === id);
      if (target?.photoPreview) URL.revokeObjectURL(target.photoPreview);
      return prev.filter((m) => m.id !== id);
    });
  };

  const setMainMenu = (id) => {
    setMenus((prev) => prev.map((m) => ({ ...m, isMain: m.id === id })));
  };

  return {
    menus,
    newMenu,
    setNewMenu,
    draftMenuPhotoPreview,
    handleDraftMenuPhotoChange,
    addMenu,
    removeMenu,
    setMainMenu,
  };
}
