import styled from "styled-components";
import { useEffect } from "react";

import { Outlet } from "react-router-dom";
import TabBar from "../../components/TabBar";

export default function AppLayout() {
  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <PageWrapper>
      <Frame>
        <Content>
          <Outlet />
        </Content>
        <TabBar />
      </Frame>
    </PageWrapper>
  );
}

/* 뷰포트 전체를 덮고 모바일 컨테이너를 중앙에 배치 */
const PageWrapper = styled.div`
  width: 100vw;
  height: var(--app-100vh);
  display: flex;
  justify-content: center;
`;

/* 모바일 앱 너비로 고정된 폰 프레임 */
const Frame = styled.div`
  width: min(402px, 100vw);
  height: var(--app-100vh);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--main-color4);
`;

const Content = styled.main`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding-bottom: calc(var(--tabbar-height) + env(safe-area-inset-bottom));
`;
