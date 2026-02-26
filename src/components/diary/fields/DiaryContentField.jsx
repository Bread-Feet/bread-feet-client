import React from "react";
import styled from "styled-components";
import { useDiaryEditorStore } from "../../../store/diaryEditorStore";

export default function DiaryContentField() {
  const content = useDiaryEditorStore((s) => s.content);
  const setContent = useDiaryEditorStore((s) => s.setContent);

  return (
    <Wrap>
      <Lines />
      <Textarea
        rows={6}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);

          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
        }}
        placeholder="오늘의 빵 이야기를 적어보세요..."
      />
    </Wrap>
  );
}

const Wrap = styled.div`
  position: relative;
  width: 100%;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 240px;

  resize: none;
  border: none;
  outline: none;

  font-size: 16px;
  line-height: 36px;

  padding: 6px 8px;
  box-sizing: border-box;

  background: transparent;
  position: relative;
  z-index: 2;
`;

const Lines = styled.div`
  position: absolute;
  inset: 0;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 34.5px,
    #ab9d8b 34.5px,
    #ab9d8b 36px
  );
`;
