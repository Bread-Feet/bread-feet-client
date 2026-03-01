import { useMemo } from "react";
import * as S from "./CalendarCard.styled";
import MonthMark from "../../assets/MonthMark.png";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function CalendarCard({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  selectedDay,
  onSelectDate,
  diaryByDay,
  onDayClick,
}) {
  const viewDate = useMemo(() => new Date(year, month - 1, 1), [year, month]);

  const daysInMonth = useMemo(() => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    return new Date(y, m + 1, 0).getDate();
  }, [viewDate]);

  const leadingBlanks = useMemo(() => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    return new Date(y, m, 1).getDay();
  }, [viewDate]);

  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth],
  );

  const handleDayClick = (day, diary) => {
    onSelectDate?.(day);
    onDayClick?.(day, diary);
  };

  return (
    <S.Card>
      <S.TopRow>
        <S.IconButton type="button" aria-label="prev month" onClick={onPrevMonth}>
          {"<"}
        </S.IconButton>
        <S.MonthTitle>
          {month}
          <S.MonthMarkImg src={MonthMark} alt="월" />
        </S.MonthTitle>
        <S.IconButton type="button" aria-label="next month" onClick={onNextMonth}>
          {">"}
        </S.IconButton>
      </S.TopRow>

      <S.WeekRow>
        {WEEKDAYS.map((day) => (
          <S.WeekCell key={day}>{day}</S.WeekCell>
        ))}
      </S.WeekRow>

      <S.Grid>
        {Array.from({ length: leadingBlanks }).map((_, idx) => (
          <S.EmptyCell key={`blank-${idx}`} />
        ))}

        {days.map((day) => {
          const diary = diaryByDay?.get(day) ?? null;
          const isSelected = day === selectedDay;

          return (
            <S.DayCellButton
              key={day}
              type="button"
              onClick={() => handleDayClick(day, diary)}
              $selected={isSelected}
              aria-label={`${day}일`}
            >
              {diary?.thumbnailUrl ? (
                <S.DiaryThumb src={diary.thumbnailUrl} alt="" />
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
