import { useState } from "react";

export default function useStoreTags() {
  const [storeTags, setStoreTags] = useState({
    drink: false, //SELL, NO_SELL
    eatIn: false, // POSSIBLE, IMPOSSIBLE
    waiting: false, // ONSITE, ONLINE
    parking: false, // HAVE, NONE
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
