import { useState } from "react";

export default function useStoreTags(initialData = null) {
  const [storeTags, setStoreTags] = useState({
    drink: initialData?.isDrink ?? null, //음료 판매 -> true, 음료 미판매 -> false
    eatIn: initialData?.isEatIn ?? null,
    waiting: initialData?.isWaiting ?? null,
    parking: initialData?.isParking ?? null,
  });

  const setTag = (key, value) => {
    setStoreTags((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  return {
    storeTags,
    setTag,
  };
}
