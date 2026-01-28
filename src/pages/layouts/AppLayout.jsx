import styled from "styled-components";

import { Outlet } from "react-router-dom";
import TabBar from "../../components/TabBar";

export default function AppLayout() {
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
  min-height: var(--app-100vh);
  padding: 0;
`;

const Content = styled.main`
  overflow: auto;
  padding-bottom: calc(var(--tabbar-height) + env(safe-area-inset-bottom));
`;
