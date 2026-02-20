import { useMemo, useState } from "react";
import * as S from "./CalendarCard.styled";
import {
  Baguette,
  CinnamonRoll,
  Croissant,
  CupCake,
  Donut,
} from "../../assets/sticker";
import MonthMark from "../../assets/MonthMark.png";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function CalendarCard({
  year,
  month,
  onPrevMonth,
  onNextMonth,
}) {
  const stickerDays = useMemo(() => {
    return new Map([
      [10, Baguette],
      [15, Croissant],
      [20, Donut],
    ]);
  }, []);

  const viewDate = useMemo(() => new Date(year, month - 1, 1), [year, month]);

  const daysInMonth = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    return new Date(year, month + 1, 0).getDate();
  }, [viewDate]);

  const leadingBlancks = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    return new Date(year, month, 1).getDay();
  }, [viewDate]);

  const days = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [daysInMonth]);

  const [selectedDay, setselectedDay] = useState(() => {
    return new Date().getDate();
  });

  const goPrevMonth = () => {
    onPrevMonth?.();
    setselectedDay(1);
  };

  const goNextMonth = () => {
    onNextMonth?.();
    setselectedDay(1);
  };

  return (
    <S.Card>
      <S.TopRow>
        <S.IconButton
          type="button"
          aria-label="prev month"
          onClick={goPrevMonth}
        >
          ‹
        </S.IconButton>
        <S.MonthTitle>
          {month}
          <S.MonthMarkImg src={MonthMark} alt="월" />
        </S.MonthTitle>
        <S.IconButton
          type="button"
          aria-label="next month"
          onClick={goNextMonth}
        >
          ›
        </S.IconButton>
      </S.TopRow>

      <S.WeekRow>
        {WEEKDAYS.map((day) => (
          <S.WeekCell key={day}>{day}</S.WeekCell>
        ))}
      </S.WeekRow>

      <S.Grid>
        {Array.from({ length: leadingBlancks }).map((_, idx) => (
          <S.EmptyCell key={`black-${idx}`} />
        ))}

        {days.map((day) => {
          const isSelected = day === selectedDay;
          const hasSticker = stickerDays.has(day);
          const sticker = stickerDays.get(day);

          return (
            <S.DayCellButton
              key={day}
              type="button"
              onClick={() => setselectedDay(day)}
              $selected={isSelected}
            >
              {hasSticker ? (
                <S.Sticker src={sticker} alt="" />
              ) : (
                <S.DayNumber>{day}</S.DayNumber>
              )}
            </S.DayCellButton>
          );
        })}
      </S.Grid>
    </S.Card>
  );
}
