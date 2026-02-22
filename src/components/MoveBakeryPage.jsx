import styled from "styled-components";

import { useNavigate } from "react-router-dom";
import { useState, useRef, useCallback, useEffect } from "react";

export default function MoveBakeryPage() {
  const nav = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const titleMenuRef = useRef(null);

  const moveToMyBakery = useCallback(() => {
    setIsMenuOpen(false);
    nav("/mybakery");
  }, [nav]);

  const moveToBakery = useCallback(() => {
    setIsMenuOpen(false);
    nav("/bakery");
  }, [nav]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!titleMenuRef.current?.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <BakeryPageMoveWrapper>
      <TitleMenuWrap ref={titleMenuRef}>
        <TitleButton
          type="button"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          <Title>나의 빵집</Title>
        </TitleButton>
        {isMenuOpen && (
          <TitleDropdown role="menu" aria-label="빵집 이동 메뉴">
            <TitleDropdownItem
              type="button"
              role="menuitem"
              onClick={moveToBakery}
            >
              나의 빵집
            </TitleDropdownItem>
            <TitleDropdownItem
              type="button"
              role="menuitem"
              onClick={moveToMyBakery}
            >
              관리자 페이지
            </TitleDropdownItem>
          </TitleDropdown>
        )}
      </TitleMenuWrap>
    </BakeryPageMoveWrapper>
  );
}

const BakeryPageMoveWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;

  margin: 12px 0;
`;

const TitleMenuWrap = styled.div`
  position: relative;
`;

const TitleButton = styled.button`
  border: 0;
  background: transparent;

  padding: 0;

  cursor: pointer;
`;

const TitleDropdown = styled.div`
  position: absolute;
  top: calc(80%);
  left: 0;
  z-index: 30;

  min-width: 150px;

  border: 1px solid #e5e5e5;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);

  padding: 4px;
`;

const TitleDropdownItem = styled.button`
  font-size: 14px;
  line-height: 20px;
  color: #111111;
  text-align: left;

  width: 100%;
  border: 0;
  border-radius: 8px;
  background: transparent;

  padding: 8px 10px;

  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;
