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

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getValidAccessToken } from "../lib/token-storage";
import LoginModal from "./LoginModal";

const tabs = [
  { key: "map", label: "위치", to: "/map", off: mapOff, on: mapOn },
  {
    key: "bakery",
    label: "나의 빵집",
    to: "/bakery",
    extraPaths: ["/mybakery"],
    off: heartOff,
    on: heartOn,
    requireAuth: true,
  },
  { key: "home", label: "홈", to: "/", off: homeOff, on: homeOn },
  {
    key: "comm",
    label: "커뮤니티",
    to: "/community",
    off: communicationOff,
    on: communicationOn,
  },
  {
    key: "diary",
    label: "다이어리",
    to: "/mydiary",
    extraPaths: ["/diary"],
    off: diaryOff,
    on: diaryOn,
  },
];

export default function TabBar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const matchedTab = tabs.find((t) => {
    if (t.to === "/") return pathname === "/";
    if (pathname.startsWith(t.to)) return true;
    return t.extraPaths?.some((p) => pathname.startsWith(p)) ?? false;
  });
  const activeKey = matchedTab?.key ?? "home";

  const handleTabClick = async (t) => {
    if (t.requireAuth) {
      const token = await getValidAccessToken();
      if (!token) {
        setShowLoginModal(true);
        return;
      }
    }
    nav(t.to);
  };

  return (
    <>
      <TabBarWrapper>
        {tabs.map((t) => {
          const isActive = t.key === activeKey;
          return (
            <TabButton key={t.key} type="button" onClick={() => handleTabClick(t)}>
              <TabIcon src={isActive ? t.on : t.off} alt="" />
              <TabLabel>{t.label}</TabLabel>
            </TabButton>
          );
        })}
      </TabBarWrapper>

      {showLoginModal && (
        <LoginModal
          onConfirm={() => {
            setShowLoginModal(false);
            nav(`/login?returnUrl=${encodeURIComponent(pathname)}`);
          }}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </>
  );
}

const TabBarWrapper = styled.nav`
  position: sticky;
  bottom: 0;
  width: min(402px, 100vw);
  margin: 0 auto;

  background: var(--main-color4);
  box-shadow: 0 -4px 4px rgba(210, 205, 205, 0.25);

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
