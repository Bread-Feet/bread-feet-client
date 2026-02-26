import React from "react";
import { createPortal } from "react-dom";
import * as S from "./StickerPickerModal.styled";
import { useDiaryEditorStore } from "../../store/diaryEditorStore";

import { STICKERS } from "../../assets/sticker";

export default function StickerPickerModal() {
  const isOpen = useDiaryEditorStore((s) => s.isStickerModalOpen);
  const close = useDiaryEditorStore((s) => s.closeStickerModal);
  const selectSticker = useDiaryEditorStore((s) => s.selectSticker);

  if (!isOpen) return null;

  return createPortal(
    <S.Overlay onClick={close}>
      <S.Sheet onClick={(e) => e.stopPropagation()}>
        <S.Header>
          <S.Title>스티커 선택</S.Title>
          <S.CloseBtn type="button" onClick={close} aria-label="닫기">
            ✕
          </S.CloseBtn>
        </S.Header>

        <S.Grid>
          {STICKERS.map((s) => (
            <S.StickerBtn
              key={s.id}
              type="button"
              onClick={() => {
                selectSticker(s.id);
              }}
            >
              <img src={s.src} alt="" />
            </S.StickerBtn>
          ))}
        </S.Grid>
      </S.Sheet>
    </S.Overlay>,
    document.body,
  );
}
