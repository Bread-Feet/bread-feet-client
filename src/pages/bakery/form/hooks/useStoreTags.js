import { useState } from "react";

export default function useStoreTags() {
  const [storeTags, setStoreTags] = useState({
    drink: null, //SELL, NO_SELL
    eatIn: null, // POSSIBLE, IMPOSSIBLE
    waiting: null, // ONSITE, ONLINE
    parking: null, // HAVE, NONE
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
