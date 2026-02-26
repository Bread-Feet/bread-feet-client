import styled from "styled-components";

export const Wrap = styled.header`
  height: calc(56px + env(safe-area-inset-top, 0px) + 8px);
  padding: calc(env(safe-area-inset-top, 0px) + 8px) 14px 0;

  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;

  background: transparent;
`;

export const Left = styled.div`
  width: 84px;
  display: flex;
  align-items: center;
`;

export const Right = styled.div`
  width: 84px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.2px;
`;

export const BackButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
`;

export const BackMarkImg = styled.img`
  width: 100%;
  display: block;
`;

export const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
`;

export const IconImg = styled.img`
  width: 100%;
  display: block;
`;
