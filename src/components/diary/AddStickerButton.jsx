import React, { useMemo } from "react";
import styled from "styled-components";
import { useDiaryEditorStore } from "../../store/diaryEditorStore";

import AddIcon from "../../assets/AddButton.png";
import { STICKERS } from "../../assets/sticker";

export default function AddStickerButton() {
  const stickerId = useDiaryEditorStore((s) => s.stickerId);
  const openStickerModal = useDiaryEditorStore((s) => s.openStickerModal);

  const iconSrc = useMemo(() => {
    if (!stickerId) return AddIcon;
    return STICKERS.find((x) => x.id === stickerId)?.src ?? AddIcon;
  }, [stickerId]);

  return (
    <Fab type="button" onClick={openStickerModal} aria-label="스티커 선택">
      <img src={iconSrc} alt="" />
    </Fab>
  );
}

const Fab = styled.button`
  position: fixed;
  right: 24px;
  bottom: 90px; /* 탭바 있으면 이 값 조절 */

  z-index: 9999;

  width: 56px;
  height: 56px;
  padding: 0;

  border: none;
  background: transparent;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 56px;
    height: 56px;
    display: block;
    user-select: none;
    -webkit-user-drag: none;
  }

  &:active {
    transform: scale(0.96);
  }
`;
