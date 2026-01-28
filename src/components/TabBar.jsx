import styled from "styled-components";
import communicationOff from "/navbar/communication_off.svg";
import communicationOn from "/navbar/communication_on.svg";
import diaryOff from "/navbar/diary_off.svg";
import diaryOn from "/navbar/diary_on.svg";
import heartOff from "/navbar/heart_off.svg";
import heartOn from "/navbar/heart_on.svg";
import homeOff from "/navbar/home_off.svg";
import homeOn from "/navbar/home_on.svg";
import mapOff from "/navbar/map_off.svg";
import mapOn from "/navbar/map_on.svg";

import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { key: "map", label: "위치", to: "/map", off: mapOff, on: mapOn },
  {
    key: "mybakery",
    label: "나의 빵집",
    to: "/mybakery",
    off: heartOff,
    on: heartOn,
  },
  { key: "home", label: "홈", to: "/", off: homeOff, on: homeOn },
  {
    key: "comm",
    label: "커뮤니티",
    to: "/community",
    off: communicationOff,
    on: communicationOn,
  },
  { key: "diary", label: "다이어리", to: "/diary", off: diaryOff, on: diaryOn },
];

export default function TabBar() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const matchedTab = tabs.find((t) => pathname.startsWith(t.to));
  let activeKey;
  if (matchedTab !== undefined && matchedTab !== null) {
    activeKey = matchedTab.key;
  } else {
    activeKey = "home";
  }

  return (
    <TabBarWrapper>
      {tabs.map((t) => {
        const isActive = t.key === activeKey;
        return (
          <TabButton key={t.key} type="button" onClick={() => nav(t.to)}>
            <TabIcon src={isActive ? t.on : t.off} alt="" />
            <TabLabel data-active={isActive}>{t.label}</TabLabel>
          </TabButton>
        );
      })}
    </TabBarWrapper>
  );
}

const TabBarWrapper = styled.nav`
  position: sticky;
  bottom: 0;
  width: min(402px, 100vw);
  margin: 0 auto;

  background: var(--main-color4);
  box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.25);

  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;

  padding: 17px calc(var(--page-padding) + env(safe-area-inset-right))
    calc(28px + env(safe-area-inset-bottom))
    calc(var(--page-padding) + env(safe-area-inset-left));
`;

const TabButton = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const TabIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const TabLabel = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: var(--gray-color);
`;
