import styled from "styled-components";

export const Card = styled.button`
  width: 330px;
  height: 235px;
  border-radius: 10px;

  background: transparent;
  border: 1.5px solid #ab9d8b;

  margin: 0 auto;

  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const Placeholder = styled.div`
  padding: 18px;
  text-align: center;
  color: rgba(0, 0, 0, 0.55);
`;

export const PlaceholderTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
`;

export const PlaceholderDesc = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.4);
`;

export const Preview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;
