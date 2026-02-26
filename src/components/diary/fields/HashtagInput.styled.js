import styled from "styled-components";

const COLORS = {
  brown: "#7C4628",
};

export const ChipWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const Chip = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;

  height: 44px;
  padding: 0 33px 0 16px;

  border-radius: 999px;
  border: 1px solid ${COLORS.brown};
  background: ${COLORS.brown};

  font-size: 14px;
  font-weight: 600;
  color: #fff;

  cursor: pointer;
`;

export const RemoveBtn = styled.span`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);

  width: 28px;
  height: 28px;
  border-radius: 999px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.9);

  pointer-events: none;
`;
