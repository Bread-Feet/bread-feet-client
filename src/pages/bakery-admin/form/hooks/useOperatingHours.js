import { useState, useRef } from "react";

export const TIME_OPTIONS = Array.from(
  { length: 25 },
  (_, h) => `${String(h).padStart(2, "0")}:00`,
);

export const toMinutes = (t) => {
  const [hh, mm] = t.split(":").map(Number);
  return hh * 60 + mm;
};

const FULL_DAYS = [
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
  "일요일",
];

function parseBusinessHours(str) {
  if (!str?.trim()) return null;

  const dayPattern = FULL_DAYS.join("|");
  const re = new RegExp(
    `(${dayPattern})\\s*([0-2]\\d:\\d\\d)\\s*-\\s*([0-2]\\d:\\d\\d)`,
    "g",
  );

  const result = [];
  let id = 1;

  for (const m of str.matchAll(re)) {
    const day = m[1];
    const start = m[2];
    const end = m[3];
    result.push({ id: id++, day, start, end });
  }

  return result.length ? result : null;
}

export default function useOperatingHours(initialData = null) {
  const parsed = initialData?.businessHours
    ? parseBusinessHours(initialData.businessHours)
    : null;

  const [hours, setHours] = useState(
    parsed ?? [
      { id: 1, day: "", start: "", end: "" },
      { id: 2, day: "", start: "", end: "" },
    ],
  );

  const nextIdRef = useRef(parsed ? parsed.length + 1 : 3);

  const addHourRow = () => {
    setHours((prev) => {
      const id = nextIdRef.current++;
      return [...prev, { id, day: "", start: "", end: "" }];
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
