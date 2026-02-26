import styled from "styled-components";

const COLORS = {
  border: "#E8EBF1",
  bg: "#FFFFFF",
  surface: "#F8F9FA",
  text: "#000000",
  gray: "#a5a5a5",
  brown: "#7C4628",
};

export const Form = styled.form`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: transparent;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  margin-left: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${COLORS.text};
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Input = styled.input`
  width: 100%;
  height: 56px;
  padding: 0 12px;
  border-radius: 20px;
  border: 1px solid ${COLORS.border};
  background: ${COLORS.surface};
  color: ${COLORS.text};
  outline: none;

  &:focus {
    border-color: ${COLORS.brown};
  }

  &::placeholder {
    color: ${COLORS.gray};
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border-radius: 20px;
  border: 1px solid ${COLORS.border};
  background: ${COLORS.surface};
  color: ${COLORS.text};
  outline: none;
  resize: vertical;

  &:focus {
    border-color: ${COLORS.brown};
  }

  &::placeholder {
    color: ${COLORS.gray};
  }
`;

export const GhostButton = styled.button`
  width: 86px;
  height: 56px;
  padding: 0 12px;
  border-radius: 20px;
  border: 1px solid ${COLORS.brown};
  background: ${COLORS.brown};
  color: ${COLORS.bg};
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: ${COLORS.surface};
    color: ${COLORS.brown};
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 46px;
  border-radius: 20px;
  border: none;
  background: ${COLORS.brown};
  color: ${COLORS.bg};
  cursor: pointer;
  font-weight: 700;

  &:hover {
    opacity: 0.9;
  }
`;
