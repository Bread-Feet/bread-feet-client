export function makeBakeryDraftBody({
  bakeryInfo,
  operatingHours,
  tags,
  menuManager,
}) {
  const trimOrEmpty = (v) => (typeof v === "string" ? v.trim() : "");

  const validMenus = Array.isArray(menuManager.menus)
    ? menuManager.menus.filter((m) => trimOrEmpty(m?.name).length > 0)
    : [];

  const mainMenu = validMenus.find((m) => m.isMain);

  return {
    name: trimOrEmpty(bakeryInfo.bakeryName),
    address: {
      detail: trimOrEmpty(bakeryInfo.detailedAddress),
      lotNumber: trimOrEmpty(bakeryInfo.lotNumber),
      roadAddress: trimOrEmpty(bakeryInfo.address),
    },
    imageUrl: "",
    phoneNumber: trimOrEmpty(bakeryInfo.phoneNumber),
    businessHours: serializeBusinessHours(operatingHours.hours),
    bestBread: trimOrEmpty(mainMenu?.name),

    isDrink: tags.storeTags.drink,
    isEatIn: tags.storeTags.eatIn,
    isWaiting: tags.storeTags.waiting,
    isParking: tags.storeTags.parking,

    menus: validMenus.map((m) => ({
      name: trimOrEmpty(m?.name),
      price: Number(m?.price ?? 0),
      thumbnailUrl: "",
      isRepresentation: m?.isMain ?? false,
    })),
  };
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
