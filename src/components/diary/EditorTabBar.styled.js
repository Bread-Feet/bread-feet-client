import styled from "styled-components";

const BROWN = "#7C4628";

// ─── 공통 래퍼 ────────────────────────────────────────────────────

export const BarWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;

  padding: 10px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  z-index: 200;

  display: flex;
  justify-content: center;
`;

export const BarInner = styled.div`
  width: min(360px, 100%);
  display: flex;
  flex-direction: column;
  gap: 8px;

  pointer-events: auto;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const MainPill = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: ${({ $mode }) => ($mode === "default" ? "46px" : "46px")};
  padding: 0 14px;
  border-radius: 28px;
  border: 1.5px solid ${BROWN};
  background: #ffffff;

  gap: ${({ $mode }) => ($mode === "default" ? "8px" : "10px")};
`;

export const AaText = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${BROWN};
  letter-spacing: -0.5px;
`;

export const TabBtn = styled.button`
  flex: 1;
  height: 40px;
  border-radius: 20px;
  border: none;
  background: ${({ $active }) =>
    $active ? "rgba(124, 70, 40, 0.1)" : "transparent"};
  color: ${BROWN};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:active {
    background: rgba(124, 70, 40, 0.15);
  }
`;

export const PillDivider = styled.div`
  width: 1px;
  height: 26px;
  background: rgba(124, 70, 40, 0.25);
  flex-shrink: 0;
  margin: 0 4px;
`;

export const ToggleArea = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 0 4px;
`;

export const ToggleLabel = styled.span`
  font-size: 9px;
  font-weight: 500;
  color: ${BROWN};
  white-space: nowrap;
`;

export const ToggleTrack = styled.button`
  width: 40px;
  height: 22px;
  border-radius: 11px;
  border: 1.5px solid ${BROWN};
  background: ${({ $on }) => ($on ? BROWN : "#ffffff")};
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: ${({ $on }) => ($on ? "flex-end" : "flex-start")};
  transition: all 0.2s ease;
`;

export const ToggleThumb = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${({ $on }) => ($on ? "#ffffff" : BROWN)};
  transition: all 0.2s ease;
`;

// ─── 그림판 모드: 컬러 팔레트 ────────────────────────────────────

export const DrawWrap = styled.div`
  position: relative;
  width: 100%;
`;

export const FontWrap = styled.div`
  width: 100%;
`;

export const FontControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FontOptionBtn = styled.button`
  flex: 1;
  height: 36px;
  border-radius: 18px;
  border: 1.5px solid ${BROWN};
  background: ${({ $active }) =>
    $active ? "rgba(124,70,40,0.14)" : "transparent"};
  color: ${BROWN};
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  font-family: ${({ $fontKey }) =>
    $fontKey === "fredoka"
      ? '"Fredoka", "Pretendard", sans-serif'
      : '"Pretendard", sans-serif'};
`;

export const PalettePopover = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(56px + 8px); /* MainPill 높이 + 간격 */

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 0;
  border: none;
  background: transparent;
`;

export const TabBtnLike = styled.button`
  flex: 0 0 32px;
  width: 32px;
  height: 32px;

  border-radius: ${({ $done }) =>
    $done ? "50%" : "20px"}; /* ✅ 완료는 동그라미 */
  border: 1.5px solid ${BROWN};

  background: ${({ $done, $active }) =>
    $done ? BROWN : $active ? "rgba(124,70,40,0.14)" : "transparent"};

  color: ${({ $done }) => ($done ? "#fff" : BROWN)}; /* ✅ 체크 흰색 */

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ColorPaletteRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 30px;
  border: 1.5px solid ${BROWN};
  background: #ffffff;
`;

export const PaletteCircle = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: ${({ $selected, $color }) =>
    $selected
      ? `2.5px solid ${BROWN}`
      : $color === "#FFFFFF"
        ? "1.5px solid #ddd"
        : "2px solid transparent"};
  cursor: pointer;
  transform: ${({ $selected }) => ($selected ? "scale(1.2)" : "scale(1)")};
  transition:
    transform 0.15s,
    border 0.15s;
  box-shadow: ${({ $selected }) =>
    $selected ? `0 0 0 2px rgba(124,70,40,0.2)` : "none"};
  flex-shrink: 0;

  &:active {
    transform: scale(0.9);
  }
`;

// ─── 그림판 모드: 드로잉 컨트롤 ──────────────────────────────────

export const DrawControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const CurrentColorBtn = styled.button`
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: ${({ $active, $color }) => {
    if ($color === "#FFFFFF") return `1.5px solid #ddd`;
    return $active ? `2.5px solid ${BROWN}` : `2px solid transparent`;
  }};
  cursor: pointer;
  box-shadow: ${({ $active }) =>
    $active ? `0 0 0 3px rgba(124,70,40,0.15)` : "none"};
  transition: all 0.15s;

  &:active {
    transform: scale(0.93);
  }
`;

export const ControlPill = styled.button`
  flex: 1;
  min-width: 0;
  height: 42px;
  border-radius: 21px;
  border: 1.5px solid
    ${({ $done, $active }) => ($done || $active ? BROWN : `${BROWN}99`)};
  background: ${({ $done, $active }) =>
    $done ? BROWN : $active ? "rgba(124,70,40,0.08)" : "#ffffff"};
  color: ${({ $done }) => ($done ? "#ffffff" : BROWN)};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ disabled }) => (disabled ? 0.28 : 1)};
  transition: all 0.15s;

  &:not(:disabled):active {
    transform: scale(0.93);
  }
`;

export const SizePill = styled.div`
  flex: 0 0 90px;
  height: 34px;

  border-radius: 18px;
  border: 1.5px solid ${BROWN}99;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

export const SizeBtn = styled.button`
  border: none;
  background: none;
  font-size: 18px;
  font-weight: 300;
  color: ${BROWN};
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    opacity: 0.5;
  }
`;

export const SizeNum = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${BROWN};
  min-width: 18px;
  text-align: center;
`;
