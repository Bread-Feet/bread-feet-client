import { useState, useRef } from "react";

export const TIME_OPTIONS = Array.from(
  { length: 25 },
  (_, h) => `${String(h).padStart(2, "0")}:00`,
);

export const toMinutes = (t) => {
  const [hh, mm] = t.split(":").map(Number);
  return hh * 60 + mm;
};

export default function useOperatingHours() {
  const [hours, setHours] = useState([
    { id: 1, day: "", start: "", end: "" },
    { id: 2, day: "", start: "", end: "" },
  ]);

  const nextIdRef = useRef(3);

  const addHourRow = () => {
    setHours((prev) => {
      const id = nextIdRef.current++;
      return [...prev, { id: id, day: "", start: "", end: "" }];
    });
  };

  const updateHour = (id, key, value) => {
    setHours((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [key]: value } : h)),
    );
  };

  const removeHourRow = (id) => {
    setHours((prev) => prev.filter((h) => h.id !== id));
  };

  return {
    hours,
    addHourRow,
    updateHour,
    removeHourRow,
    TIME_OPTIONS,
    toMinutes,
  };
}
