import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 14px;
  color: #555;
`;

export const SubmitButton = styled.button`
  margin-top: 24px;
  padding: 14px 0;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  background-color: #222;
  color: #fff;
  cursor: pointer;
`;

export const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const Input = styled.input`
  width: 80%;
  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  resize: vertical;
`;

export const GhostButton = styled.button`
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  background: white;
`;

export const PreviewImage = styled.img`
  width: 100%;
  max-width: 360px;
  border-radius: 12px;
  margin-top: 8px;
`;

export const ChipWrap = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

export const Chip = styled.button`
  border: 1px solid #e5e5e5;
  background: white;
  border-radius: 999px;
  padding: 6px 10px;
`;
