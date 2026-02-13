export function validateBakeryBody(body) {
  if (!body?.name?.trim()) throw new Error("빵집 이름은 필수입니다.");

  const a = body?.address;
  if (!a?.lotNumber?.trim()) throw new Error("지번 주소는 필수입니다.");
  if (!a?.roadAddress?.trim()) throw new Error("도로명 주소는 필수입니다.");

  if (!body?.imageUrl?.trim()) throw new Error("대표 사진은 필수입니다.");

  if (!body?.phoneNumber?.trim()) throw new Error("전화번호는 필수입니다.");
  if (!body?.businessHours?.trim()) throw new Error("영업 시간은 필수입니다.");

  if (!body?.bestBread?.trim()) throw new Error("대표 빵은 필수입니다.");
}

export function serializeBusinessHours(hours) {
  const dayOrder = {
    월요일: 1,
    화요일: 2,
    수요일: 3,
    목요일: 4,
    금요일: 5,
    토요일: 6,
    일요일: 7,
  };

  if (!Array.isArray(hours)) return String(hours ?? "").trim();
  return hours
    .filter((h) => h?.day && h?.start && h?.end)
    .slice()
    .sort((a, b) => {
      const aOrder = dayOrder[a.day] ?? 999;
      const bOrder = dayOrder[b.day] ?? 999;
      return aOrder - bOrder;
    })
    .map((h) => `${h.day} ${h.start}-${h.end}`)
    .join(" ");
}
