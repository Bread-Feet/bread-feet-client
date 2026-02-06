import { useState, useEffect } from "react";

export default function useBakeryInfo() {
  const [bakeryName, setBakeryName] = useState("");
  const handleBakeryNameChange = (e) => {
    setBakeryName(e.target.value);
  };

  const [address, setAddress] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const handleDetailedAddressChange = (e) => {
    setDetailedAddress(e.target.value);
  };

  const [phoneNumber, setPhoneNumber] = useState("");
  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const [webpage, setWebpage] = useState("");
  const handleWebpageChange = (e) => {
    setWebpage(e.target.value);
  };

  const [mainPhoto, setMainPhoto] = useState(null);
  const [mainPhotoPreview, setMainPhotoPreview] = useState(null);

  const handleMainPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있어요.");
      e.target.value = "";
      return;
    }

    setMainPhoto(file);
    setMainPhotoPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (mainPhotoPreview) {
        URL.revokeObjectURL(mainPhotoPreview);
      }
    };
  }, [mainPhotoPreview]);

  return {
    bakeryName,
    handleBakeryNameChange,
    address,
    setAddress,
    detailedAddress,
    handleDetailedAddressChange,
    phoneNumber,
    handlePhoneNumberChange,
    webpage,
    handleWebpageChange,
    mainPhotoPreview,
    handleMainPhotoChange,
    mainPhoto,
  };
}
