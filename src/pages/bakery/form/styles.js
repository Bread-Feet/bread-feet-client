import styled from "styled-components";

export const FormSection = styled.div`
  margin: 12px 16px;
`;

export const SectionName = styled.h2`
  font-size: 12px;
  color: var(--main-color2);

  margin: 8px 8px 0 8px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0 8px;
  margin: 15px 0 0 0;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #111;

  margin-bottom: 6px;
`;

export const Input = styled.input`
  font-size: 16px;

  width: 100%;
  height: 56px;

  background: #f8f9fa;
  border: solid 1px #e8ebf1;
  border-radius: 20px;

  padding: 0 20px;
  margin: 0 0 5px 0;

  outline: none;

  &:focus {
    outline: solid 2px var(--main-color2);
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  }

  &::placeholder {
    color: #a5a5a5;
  }
`;

export const PhotoBox = styled.label`
  width: 135px;
  height: 135px;

  border-radius: 20px;
  border: dashed 0.5px #e8ebf1;
  background: #f8f9fa;

  margin: 5px 0;

  display: grid;
  place-items: center;
  overflow: hidden;

  position: relative;

  cursor: pointer;
`;

export const PhotoInput = styled.input`
  width: 100%;
  height: 100%;

  border: 0;
  inset: 0;
  opacity: 0;

  position: absolute;

  cursor: pointer;
`;

export const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Plus = styled.img``;

export const DeleteButton = styled.button`
  border: none;
  background: transparent;

  padding: 0;

  cursor: pointer;
`;

export const DeleteImg = styled.img``;

export const InlineAction = styled.button`
  font-size: 14px;
  font-weight: 600;
  color: var(--main-color2);

  border: none;
  background: transparent;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  gap: 6px;
`;
