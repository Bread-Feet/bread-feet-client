import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;

  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(2px);

  display: flex;
  align-items: flex-end;
  justify-content: center;

  padding: 16px;
`;

export const Sheet = styled.div`
  width: min(420px, 100%);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(171, 157, 139, 0.55);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);

  overflow: hidden;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 14px 14px 10px 14px;
  border-bottom: 1px solid rgba(171, 157, 139, 0.35);
`;

export const Title = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.8);
`;

export const CloseBtn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 10px;

  border: none;
  background: transparent;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  color: rgba(0, 0, 0, 0.6);
  font-size: 16px;

  &:hover {
    background: rgba(171, 157, 139, 0.12);
  }

  &:active {
    transform: scale(0.96);
  }
`;

export const Grid = styled.div`
  padding: 14px;

  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;

  @media (max-width: 380px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const StickerBtn = styled.button`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 14px;

  border: 1px solid rgba(171, 157, 139, 0.45);
  background: rgba(255, 255, 255, 0.55);
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 42px;
    height: 42px;
    display: block;
    user-select: none;
    -webkit-user-drag: none;
  }

  &:hover {
    background: rgba(171, 157, 139, 0.12);
  }

  &:active {
    transform: scale(0.97);
  }
`;
