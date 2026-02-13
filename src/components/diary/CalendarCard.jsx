import { useMemo, useState } from "react";
import * as S from "./CalendarCard.styled";
import {
  Baguette,
  CinnamonRoll,
  Croissant,
  CupCake,
  Donut,
} from "../../assets/sticker";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function CalendarCard() {
  const stickerDays = useMemo(() => {
    return new Map([
      [10, Baguette],
      [15, Croissant],
      [20, Donut],
    ]);
  }, []);

  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const daysInMonth = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    return new Date(year, month + 1, 0).getDate();
  }, [viewDate]);

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", { month: "short" }).format(
      viewDate,
    );
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
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    setselectedDay(1);
  };

  const goNextMonth = () => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
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
        <S.MonthTitle>{monthLabel}</S.MonthTitle>
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
