const logoImg = "/menu_example_img.svg";

import { useState, useRef, useEffect } from "react";

const isBlobUrl = (url) => typeof url === "string" && url.startsWith("blob:");

export default function useMenuManager() {
  const [menus, setMenus] = useState([
    {
      id: 1,
      name: "소금빵",
      price: 2800,
      isMain: true,
      photoPreview: logoImg,
      photo: null,
    },
    {
      id: 2,
      name: "크림빵",
      price: 4500,
      isMain: false,
      photoPreview: logoImg,
      photo: null,
    },
  ]);

  // 메뉴 추가용 임시 상태
  const [newMenu, setNewMenu] = useState({
    name: "",
    price: "",
    photoPreview: null,
    photo: null,
  });

  const menusRef = useRef(menus);
  const newMenuRef = useRef(newMenu);

  useEffect(() => {
    menusRef.current = menus;
  }, [menus]);

  useEffect(() => {
    newMenuRef.current = newMenu;
  }, [newMenu]);

  useEffect(() => {
    return () => {
      const nm = newMenuRef.current;
      if (isBlobUrl(nm?.photoPreview)) URL.revokeObjectURL(nm.photoPreview);

      const ms = menusRef.current || [];
      ms.forEach((m) => {
        if (isBlobUrl(m?.photoPreview)) URL.revokeObjectURL(m.photoPreview);
      });
    };
  }, []);

  const handleDraftMenuPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있어요.");
      e.target.value = "";
      return;
    }

    setNewMenu((prev) => {
      if (isBlobUrl(prev.photoPreview)) URL.revokeObjectURL(prev.photoPreview);
      return {
        ...prev,
        photoPreview: URL.createObjectURL(file),
        photo: file,
      };
    });

    e.target.value = "";
  };

  const addMenu = () => {
    if (!newMenu.name.trim()) return;

    const priceNum = Number(newMenu.price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      alert("가격은 0 이상 숫자만 입력할 수 있어요.");
      return;
    }

    setMenus((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newMenu.name.trim(),
        price: priceNum,
        isMain: prev.length === 0,
        photoPreview: newMenu.photoPreview || logoImg,
        photo: newMenu.photo,
      },
    ]);

    setNewMenu(() => ({
      name: "",
      price: "",
      photoPreview: null,
      photo: null,
    }));
  };

  const removeMenu = (id) => {
    setMenus((prev) => {
      const target = prev.find((m) => m.id === id);
      if (target && isBlobUrl(target.photoPreview))
        URL.revokeObjectURL(target.photoPreview);
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
    handleDraftMenuPhotoChange,
    addMenu,
    removeMenu,
    setMainMenu,
  };
}
