import styled from "styled-components";

export const Wrap = styled.div`
  margin: 12px 16px;
  height: 48px;

  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  align-items: center;
  align-content: center;

  border-radius: 10px;
  border: 1px solid #ab9d8b;

  background: transparent;
  backdrop-filter: blur(6px);
`;

export const Left = styled.div`
  padding: 0 14px;
  font-size: 14px;
  color: #000000;
  white-space: nowrap;
`;

export const Divider = styled.div`
  width: 1px;
  height: 60px;
  background-color: #ab9d8b;
`;

export const Right = styled.div`
  padding-left: 14px;
  font-size: 13px;
  color: #000000;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MapPinImg = styled.img`
  width: 16px;
  height: 15px;
  margin-right: 6px;
  vertical-align: middle;
`;
