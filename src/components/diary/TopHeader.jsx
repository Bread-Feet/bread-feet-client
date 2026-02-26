import styled from "styled-components";
import { useState, useMemo } from "react";
import "../../assets/font.css";

export default function TopHeader({ year, onYearChange }) {
  const [open, setOpen] = useState(false);
  const years = useMemo(() => {
    const thisYear = new Date().getFullYear();
    return Array.from({ length: 7 }, (_, i) => thisYear - 3 + i);
  }, []);

  return (
    <Wrap>
      <Center>
        <Logo src="/bread-feet-logo-login.png" aria-hidden />
        <Title>Bread Diary</Title>
      </Center>

      <YearButton type="button" onClick={() => setOpen((v) => !v)}>
        <YearText>{year}</YearText>
        <Chevron aria-hidden>▼</Chevron>
      </YearButton>

      {open && (
        <Menu>
          {years.map((y) => (
            <MenuItem
              key={y}
              type="button"
              aria-selected={y === year}
              $active={y === year}
              onClick={() => {
                onYearChange?.(y);
                setOpen(false);
              }}
            >
              {y}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Wrap>
  );
}

const Wrap = styled.header`
  position: relative;
  width: min(360px, 100%);
  padding: 16px 0 8px;
  display: flex;
  justify-content: center;
`;

const Center = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const Logo = styled.img`
  width: 92px;
  height: 92px;
  border-radius: 24px;
  margin-bottom: 0;
`;

const Title = styled.h1`
  margin: 0;
  font-family: "Fredoka";
  font-size: 20px;
  font-weight: 700;
`;

const YearButton = styled.button`
  position: absolute;
  top: 12px;
  right: 0;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 10px 14px;
  border: none;
  border-radius: 999px;
  background: #fff;

  cursor: pointer;
`;

const Menu = styled.div`
  position: absolute;
  top: 64px;
  right: 0;
  width: 120px;
  padding: 8px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 20;
`;

const MenuItem = styled.button`
  width: 100%;
  border: none;
  background: ${({ $active }) =>
    $active ? "rgba(0,0,0,0.06)" : "transparent"};
  border-radius: 10px;
  padding: 10px 12px;
  text-align: left;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }
`;

const YearText = styled.span`
  font-family: "Fredoka";
  font-size: 20px;
  font-weight: 700;
`;

const Chevron = styled.span`
  font-size: 14px;
  opacity: 0.7;
`;
