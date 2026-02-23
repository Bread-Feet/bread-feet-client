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
  { key: "diary", label: "다이어리", to: "/diary", off: diaryOff, on: diaryOn },
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

function LoginModal({ onConfirm, onClose }) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalCloseBtn type="button" onClick={onClose} aria-label="닫기">
          ×
        </ModalCloseBtn>
        <ModalMessage>로그인하시겠습니까?</ModalMessage>
        <ModalConfirmBtn type="button" onClick={onConfirm}>
          네
        </ModalConfirmBtn>
      </ModalBox>
    </ModalOverlay>
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

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  position: relative;
  width: 280px;
  background: #fff;
  border-radius: 20px;
  padding: 36px 24px 24px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const ModalCloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 16px;

  border: 0;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  color: #9e9e9e;
  cursor: pointer;

  &:active {
    opacity: 0.7;
  }
`;

const ModalMessage = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin: 0;
  text-align: center;
`;

const ModalConfirmBtn = styled.button`
  font-size: 15px;
  font-weight: 600;
  color: var(--main-color4);

  width: 100%;
  padding: 13px 0;

  border: 0;
  border-radius: 14px;
  background: var(--main-color2);

  cursor: pointer;

  &:active {
    opacity: 0.85;
  }
`;
