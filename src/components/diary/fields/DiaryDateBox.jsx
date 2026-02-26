import React from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./DiaryDateBox.styled";

import MapPin from "../../../assets/MapPin.png";
import { useDiaryEditorStore } from "../../../store/diaryEditorStore";

export default function DiaryDateBox() {
  const navigate = useNavigate();

  const date = useDiaryEditorStore((s) => s.date);
  const bakery = useDiaryEditorStore((s) => s.bakery);

  let formatted = "날짜를 선택하세요";
  if (date) {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekday = d.toLocaleDateString("ko-KR", { weekday: "long" });
    formatted = `${month}월 ${day}일 ${weekday}`;
  }

  const bakeryLabel = bakery?.name ? bakery.name : "빵집을 추가하세요!";

  const goPickBakery = () => {
    if (!date) return;

    navigate(`/diary/bakery?date=${encodeURIComponent(date)}`);
  };

  return (
    <S.Wrap>
      <S.Left>{formatted}</S.Left>
      <S.Divider />

      <S.Right role="button" tabIndex={0} onClick={goPickBakery}>
        <S.MapPinImg src={MapPin} alt="빵집 추가" />
        {bakeryLabel}
      </S.Right>
    </S.Wrap>
  );
}
