import React from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./EditorHeader.styled";
import BackMark from "../../assets/BackMark.svg";
import saveDraftIcon from "../../assets/saveDraftIcon.png";
import saveIcon from "../../assets/saveIcon.png";

export default function DiaryEditorHeader({
  title = "다이어리 작성하기",
  onSubmit,
  isSubmitting = false,
}) {
  const navigate = useNavigate();

  return (
    <S.Wrap>
      <S.Left>
        <S.BackButton
          type="button"
          onClick={() => navigate(-1)}
          aria-label="back"
        >
          <S.BackMarkImg src={BackMark} alt="뒤로가기" />
        </S.BackButton>
      </S.Left>

      <S.Title>{title}</S.Title>

      <S.Right>
        <S.IconButton type="button" aria-label="save-draft">
          <S.IconImg src={saveDraftIcon} alt="임시저장" />
        </S.IconButton>
        <S.IconButton
          type="button"
          aria-label="save-diary"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          <S.IconImg src={saveIcon} alt="저장" />
        </S.IconButton>
      </S.Right>
    </S.Wrap>
  );
}
