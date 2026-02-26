import React from "react";
import styled from "styled-components";
import { useDiaryEditorStore } from "../../../store/diaryEditorStore";

export default function DiaryTitleField() {
  const title = useDiaryEditorStore((s) => s.title);
  const setTitle = useDiaryEditorStore((s) => s.setTitle);

  return (
    <Wrap>
      <Label htmlFor="diary-title">제목:</Label>
      <Input
        id="diary-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력해주세요!"
        maxLength={40}
      />
    </Wrap>
  );
}

const Wrap = styled.div`
  width: 100%;
  height: 40px;

  gap: 2px;

  display: flex;
  align-items: center;

  padding: 0 12px;
  box-sizing: border-box;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 400;
  color: #ab9d8b;
  white-space: nowrap;
`;

const Input = styled.input`
  flex: 1;
  height: 30px;

  padding: 0 6px;
  box-sizing: border-box;
  border-radius: 12px;
  border: none;

  background: transparent;
  font-size: 16px;
  font-weight: 400;
  color: #ab9d8b;

  outline: none;
`;
