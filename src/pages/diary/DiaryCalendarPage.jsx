import CalenderCard from "../../components/diary/CalendarCard";
import styled from "styled-components";

export default function DiaryCalenderPage() {
  return (
    <Screen>
      <Content>
        <CardWrap>
          <CalenderCard />
        </CardWrap>
      </Content>
    </Screen>
  );
}

export const Screen = styled.main`
  position: relative;
  width: 100%;
  box-sizing: border-box;
`;

export const Content = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
`;

export const CardWrap = styled.div`
  width: min(360px, 100%);
`;
