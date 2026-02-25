import React, { useEffect, useMemo, useRef } from "react";
import * as S from "./MediaCanvas.styled";
import { useDiaryEditorStore } from "../../store/diaryEditorStore";

export default function MediaCanvas() {
  const inputRef = useRef(null);

  const baseImage = useDiaryEditorStore((s) => s.baseImage);
  const setBaseImage = useDiaryEditorStore((s) => s.setBaseImage);

  // File이면 미리보기 URL 생성
  const previewUrl = useMemo(() => {
    if (!baseImage) return null;
    if (typeof baseImage === "string") return baseImage; // url 저장 방식도 대비
    return URL.createObjectURL(baseImage);
  }, [baseImage]);

  // objectURL 정리
  useEffect(() => {
    if (!baseImage || typeof baseImage === "string") return;
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [baseImage, previewUrl]);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일만
    if (!file.type.startsWith("image/")) return;

    setBaseImage(file);

    // 같은 파일 재선택 가능하도록 초기화
    e.target.value = "";
  };

  return (
    <S.Card type="button" onClick={openFilePicker}>
      <S.HiddenInput
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onPickFile}
      />

      {previewUrl ? (
        <S.Preview src={previewUrl} alt="첨부 이미지" />
      ) : (
        <S.Placeholder>
          <S.PlaceholderTitle>사진을 추가하세요</S.PlaceholderTitle>
          <S.PlaceholderDesc>
            추가한 사진 위에 그림도 그릴 수 있어요 ✏️
          </S.PlaceholderDesc>
        </S.Placeholder>
      )}
    </S.Card>
  );
}
