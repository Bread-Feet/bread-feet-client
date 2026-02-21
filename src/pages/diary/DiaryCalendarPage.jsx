import CalendarCard from "../../components/diary/CalendarCard";
import Header from "../../components/diary/TopHeader";
import styled from "styled-components";
import AddIcon from "../../assets/AddButton.png";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DiaryCalenderPage() {
  const navigate = useNavigate();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(today.getDate());

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

  return (
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
          />
        </CardWrap>
        <Fab onClick={() => navigate(`/diary/new?date=${yyyyMmDd}`)}>
          <img src={AddIcon} alt="새 기록 추가" />
        </Fab>
      </Content>
    </Screen>
  );
}

export const Screen = styled.main`
  width: 100%;
  min-height: 100vh;
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
  bottom: 100px; /* 탭바 고려 */

  background: transparent;
  border: none;
  cursor: pointer;

  img {
    width: 72px;
    height: 72px;
  }
`;
