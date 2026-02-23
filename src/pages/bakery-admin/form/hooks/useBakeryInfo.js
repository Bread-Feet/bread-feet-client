import { useState, useEffect } from "react";
import { openDaumPostcode } from "../../../../lib/daum-postcode";

export default function useBakeryInfo(initialData = null) {
  const [bakeryName, setBakeryName] = useState(initialData?.name ?? "");
  const handleBakeryNameChange = (e) => {
    setBakeryName(e.target.value);
  };

  const [lotNumber, setLotNumber] = useState(
    initialData?.address?.lotNumber ?? "",
  );
  const [address, setAddress] = useState(
    initialData?.address?.roadAddress ?? "",
  );
  const [detailedAddress, setDetailedAddress] = useState(
    initialData?.address?.detail ?? "",
  );
  const handleDetailedAddressChange = (e) => {
    setDetailedAddress(e.target.value);
  };
  const handleSearchAddress = async () => {
    try {
      const data = await openDaumPostcode();
      setLotNumber(data.jibunAddress || data.autoJibunAddress || "");
      setAddress(data.roadAddress || data.autoRoadAddress || "");
    } catch (err) {
      const msg = String(err?.message || "");
      if (msg.startsWith("Postcode closed:")) return;
      console.warn(err);
    }
  };

  const [phoneNumber, setPhoneNumber] = useState(
    initialData?.phoneNumber ?? "",
  );
  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const [mainPhoto, setMainPhoto] = useState(null);
  const [mainPhotoPreview, setMainPhotoPreview] = useState(
    initialData?.imageUrl ?? null,
  );

  const handleMainPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있어요.");
      e.target.value = "";
      return;
    }

    setMainPhoto(file);
    setMainPhotoPreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  useEffect(() => {
    return () => {
      if (mainPhotoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(mainPhotoPreview);
      }
    };
  }, [mainPhotoPreview]);

  return {
    bakeryName,
    handleBakeryNameChange,
    lotNumber,
    setLotNumber,
    address,
    setAddress,
    detailedAddress,
    handleDetailedAddressChange,
    handleSearchAddress,
    phoneNumber,
    handlePhoneNumberChange,
    mainPhotoPreview,
    handleMainPhotoChange,
    mainPhoto,
  };
}
