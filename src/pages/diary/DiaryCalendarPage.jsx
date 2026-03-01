import PageLayout from "../../components/layout/PageLayout";
import CalendarCard from "../../components/diary/CalendarCard";
import Header from "../../components/diary/TopHeader";
import styled from "styled-components";
import AddIcon from "../../assets/AddButton.png";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDiaries } from "../../lib/api/diary";

const FETCH_SIZE = 100;

export default function DiaryCalenderPage() {
  const navigate = useNavigate();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [myDiaries, setMyDiaries] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadAllMyDiaries() {
      try {
        const all = [];
        let cursor = 0;

        while (true) {
          const data = await fetchDiaries({
            cursor,
            size: FETCH_SIZE,
            isMyDiary: true,
          });
          const content = data?.content ?? [];
          const sliceInfo = data?.sliceInfo;

          all.push(...content);

          if (sliceInfo?.last) break;

          const nextCursor =
            sliceInfo?.cursor ?? content[content.length - 1]?.cursorId ?? null;
          if (nextCursor == null || nextCursor === cursor) break;
          cursor = nextCursor;
        }

        if (!cancelled) {
          setMyDiaries(all);
        }
      } catch (err) {
        console.error("[DiaryCalendarPage] failed to load my diaries", err);
        if (!cancelled) setMyDiaries([]);
      }
    }

    loadAllMyDiaries();

    return () => {
      cancelled = true;
    };
  }, []);

  const goPrevMonth = () => {
    setMonth((m) => {
      if (m === 1) {
        setYear((y) => y - 1);
        return 12;
      }
      return m - 1;
    });
    setSelectedDate(1);
  };

  const goNextMonth = () => {
    setMonth((m) => {
      if (m === 12) {
        setYear((y) => y + 1);
        return 1;
      }
      return m + 1;
    });
    setSelectedDate(1);
  };

  const yyyyMmDd = useMemo(() => {
    return `${year}-${String(month).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
  }, [year, month, selectedDate]);

  const diaryByDay = useMemo(() => {
    const monthPrefix = `${year}-${String(month).padStart(2, "0")}-`;
    const map = new Map();

    myDiaries.forEach((diary) => {
      const visitDate = typeof diary?.visitDate === "string" ? diary.visitDate : "";
      const ymd = visitDate.slice(0, 10);
      if (!ymd.startsWith(monthPrefix)) return;

      const day = Number(ymd.slice(8, 10));
      if (!Number.isInteger(day) || day < 1 || map.has(day)) return;

      map.set(day, {
        id: diary.id,
        thumbnailUrl: diary.thumbnailUrl ?? "",
      });
    });

    return map;
  }, [myDiaries, year, month]);

  const handleDayClick = (day, diary) => {
    if (diary?.id != null) {
      navigate(`/diary/${diary.id}`);
      return;
    }
    setSelectedDate(day);
  };

  return (
    <PageLayout>
      <Screen>
        <Content>
          <Header year={year} onYearChange={setYear} />
          <CardWrap>
            <CalendarCard
              year={year}
              month={month}
              onPrevMonth={goPrevMonth}
              onNextMonth={goNextMonth}
              onSelectDate={setSelectedDate}
              selectedDay={selectedDate}
              diaryByDay={diaryByDay}
              onDayClick={handleDayClick}
            />
          </CardWrap>
          <Fab onClick={() => navigate(`/diary/new?date=${yyyyMmDd}`)}>
            <img src={AddIcon} alt="새 기록 추가" />
          </Fab>
        </Content>
      </Screen>
    </PageLayout>
  );
}

export const Screen = styled.main`
  width: 100%;
  height: 100vh;
  background: #f8edd0;
  overflow: hidden;
`;

export const Content = styled.div`
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
  padding-bottom: 120px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const CardWrap = styled.div`
  width: min(360px, 100%);
`;

const Fab = styled.button`
  position: fixed;
  right: calc(max(0px, (100vw - 402px) / 2) + 20px);
  bottom: 100px;

  background: transparent;
  border: none;
  cursor: pointer;

  img {
    width: 72px;
    height: 72px;
  }
`;
