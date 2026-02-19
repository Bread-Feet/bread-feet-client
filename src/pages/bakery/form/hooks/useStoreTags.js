import { useState } from "react";

export default function useStoreTags() {
  const [storeTags, setStoreTags] = useState({
    drink: null, //음료 판매 -> true, 음료 미판매 -> false
    eatIn: null,
    waiting: null,
    parking: null,
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
