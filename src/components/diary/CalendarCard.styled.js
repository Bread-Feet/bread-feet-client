import styled from "styled-components";
import "../../assets/font.css";

const COLORS = {
  brown: "#7C4628",
  gray: "#A5A5A5",
  black: "#000000",
};

const S = 35;
const GAP = 15;

export const Card = styled.div`
  padding-top: 4px;
  width: min(360px, 100%);
  aspect-ratio: 460 / 430;
  height: auto;
  border-radius: 20px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 6px;
`;

export const MonthTitle = styled.div`
  font-family: "Fredoka";
  font-size: 28px;
  font-weight: 700;
  color: ${COLORS.brown};
  letter-spacing: -0.2px;
  display: flex;
  align-items: flex-end;
`;

export const MonthMarkImg = styled.img`
  width: 30px;
  height: 40px;
  display: block;
  transform: translateY(3px);
`;

export const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: ${COLORS.brown};
  font-size: 22px;
  cursor: pointer;
  display: grid;
  place-items: center;

  &:active {
    transform: translateY(1px);
  }
`;

export const WeekRow = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(7, ${S}px);
  column-gap: ${GAP}px;
  margin-top: 12px;
`;

export const WeekCell = styled.div`
  height: 26px;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 600;
  color: ${COLORS.gray};
`;

export const Grid = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(7, ${S}px);
  grid-auto-rows: ${S}px;
  justify-content: center;
  gap: ${GAP}px;
`;

export const EmptyCell = styled.div`
  width: ${S}px;
  height: ${S}px;
`;

export const DayCellButton = styled.button`
  width: ${S}px;
  height: ${S}px;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  position: relative;
  display: grid;
  place-items: center;
  border-radius: 50%;
  overflow: hidden;
  outline: ${({ $selected }) => ($selected ? `3px dashed ${COLORS.brown}` : "none")};
  outline-offset: 2;
`;

export const DiaryThumb = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
`;

export const DayNumber = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${COLORS.black};
`;
