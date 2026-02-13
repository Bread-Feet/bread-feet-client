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
    <Frame>
      <Content>
        <Outlet />
      </Content>
      <TabBar />
    </Frame>
  );
}

const Frame = styled.div`
  height: var(--app-100vh);
  display: flex;
  flex-direction: column;
  padding: 0;
`;

const Content = styled.main`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding-bottom: calc(var(--tabbar-height) + env(safe-area-inset-bottom));
`;
