import React, { useRef, useState } from "react";
import * as S from "./EditorTabBar.styled";
import { useDiaryEditorStore } from "../../store/diaryEditorStore";

import Eraser from "../../assets/Eraser.png";

const DRAW_COLORS = [
  "#E33B3B",
  "#F5892A",
  "#F5C73A",
  "#4CBB6F",
  "#4A90D9",
  "#9B55CC",
  "#A0763B",
  "#1A1A1A",
  "#888888",
  "#FFFFFF",
];

// ─── 탭바 아이콘 SVG ──────────────────────────────────────────────

function FontIcon() {
  return <S.AaText>Aa</S.AaText>;
}

function ImageIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="16" height="13" rx="2" />
      <circle cx="7" cy="9" r="1.5" fill="currentColor" stroke="none" />
      <path d="M2 14l4-4 3.5 3.5 2.5-2.5L18 17" />
    </svg>
  );
}

function StickerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 3h8l5 5v9a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" />
      <path d="M12 3v5h5" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 3l3 3L7 16H4v-3L14 3z" />
    </svg>
  );
}

// ─── 그림판 컨트롤 아이콘 SVG ─────────────────────────────────────

function UndoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7h8a4 4 0 010 8H7" />
      <path d="M3 7L6 4M3 7l3 3" />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 7H7a4 4 0 000 8h4" />
      <path d="M15 7l-3-3M15 7l-3 3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 5h12M7 5V3h4v2M6 5v9h6V5H6z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l5 5 7-8" />
    </svg>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────

export default function EditorTabBar() {
  const imageInputRef = useRef(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const activeTab = useDiaryEditorStore((s) => s.activeTab);
  const isPublic = useDiaryEditorStore((s) => s.isPublic);
  const tool = useDiaryEditorStore((s) => s.tool);
  const color = useDiaryEditorStore((s) => s.color);
  const brushSize = useDiaryEditorStore((s) => s.brushSize);
  const strokes = useDiaryEditorStore((s) => s.strokes);
  const undoneStrokes = useDiaryEditorStore((s) => s.undoneStrokes);

  const setActiveTab = useDiaryEditorStore((s) => s.setActiveTab);
  const setIsPublic = useDiaryEditorStore((s) => s.setIsPublic);
  const setTool = useDiaryEditorStore((s) => s.setTool);
  const setColor = useDiaryEditorStore((s) => s.setColor);
  const setBrushSize = useDiaryEditorStore((s) => s.setBrushSize);
  const setBaseImage = useDiaryEditorStore((s) => s.setBaseImage);
  const undoStroke = useDiaryEditorStore((s) => s.undoStroke);
  const redoStroke = useDiaryEditorStore((s) => s.redoStroke);
  const clearStrokes = useDiaryEditorStore((s) => s.clearStrokes);

  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setBaseImage(file);
    e.target.value = "";
  };

  const handleImageTab = () => {
    imageInputRef.current?.click();
  };

  const handleColorSelect = (c) => {
    setColor(c);
    setTool("pen");
    setIsPaletteOpen(false);
  };

  const handleDone = () => {
    setActiveTab("draw"); // 같은 탭 재클릭 → 닫기(null)
    setTool("pen");
  };

  // ── 그림판 모드 ──
  if (activeTab === "draw") {
    return (
      <S.BarWrapper>
        <S.BarInner>
          <S.DrawWrap>
            {isPaletteOpen && (
              <S.PalettePopover>
                {DRAW_COLORS.map((c) => (
                  <S.PaletteCircle
                    key={c}
                    type="button"
                    $color={c}
                    $selected={color === c && tool === "pen"}
                    onClick={() => handleColorSelect(c)}
                    aria-label={c}
                  />
                ))}
              </S.PalettePopover>
            )}

            {/* 드로잉 컨트롤 */}
            <S.MainPill $mode="draw">
              {/* 현재 색상 미리보기 */}
              <S.CurrentColorBtn
                type="button"
                $color={color}
                $active={isPaletteOpen}
                onClick={() => {
                  setTool("pen");
                  setIsPaletteOpen((v) => !v);
                }}
                aria-label="펜 선택"
              />

              {/* 지우개 */}
              <S.TabBtnLike
                type="button"
                $active={tool === "eraser"}
                onClick={() => setTool(tool === "eraser" ? "pen" : "eraser")}
                aria-label="지우개"
              >
                <img src={Eraser} />
              </S.TabBtnLike>

              {/* 굵기 */}
              <S.SizePill>
                <S.SizeBtn
                  type="button"
                  onClick={() => setBrushSize(Math.max(1, brushSize - 1))}
                  aria-label="굵기 감소"
                >
                  −
                </S.SizeBtn>
                <S.SizeNum>{brushSize}</S.SizeNum>
                <S.SizeBtn
                  type="button"
                  onClick={() => setBrushSize(Math.min(30, brushSize + 1))}
                  aria-label="굵기 증가"
                >
                  +
                </S.SizeBtn>
              </S.SizePill>

              {/* 실행취소 */}
              <S.TabBtnLike
                type="button"
                disabled={strokes.length === 0}
                onClick={undoStroke}
                aria-label="실행 취소"
              >
                <UndoIcon />
              </S.TabBtnLike>

              {/* 다시실행 */}
              <S.TabBtnLike
                type="button"
                disabled={undoneStrokes.length === 0}
                onClick={redoStroke}
                aria-label="다시 실행"
              >
                <RedoIcon />
              </S.TabBtnLike>

              {/* 전체 지우기 */}
              <S.TabBtnLike
                type="button"
                onClick={clearStrokes}
                aria-label="전체 지우기"
              >
                <TrashIcon />
              </S.TabBtnLike>

              {/* 완료 */}
              <S.TabBtnLike
                type="button"
                $done
                onClick={handleDone}
                aria-label="완료"
              >
                <CheckIcon />
              </S.TabBtnLike>
            </S.MainPill>
          </S.DrawWrap>
        </S.BarInner>
      </S.BarWrapper>
    );
  }

  // ── 기본 탭바 ──
  return (
    <S.BarWrapper>
      <S.BarInner>
        <S.HiddenInput
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={onPickImage}
        />
        <S.MainPill $mode="default">
          <S.TabBtn
            type="button"
            $active={activeTab === "font"}
            onClick={() => setActiveTab("font")}
            aria-label="폰트 변경"
          >
            <FontIcon />
          </S.TabBtn>

          <S.TabBtn
            type="button"
            onClick={handleImageTab}
            aria-label="이미지 삽입"
          >
            <ImageIcon />
          </S.TabBtn>

          <S.TabBtn
            type="button"
            $active={activeTab === "sticker"}
            onClick={() => setActiveTab("sticker")}
            aria-label="스티커 삽입"
          >
            <StickerIcon />
          </S.TabBtn>

          <S.TabBtn
            type="button"
            $active={activeTab === "draw"}
            onClick={() => setActiveTab("draw")}
            aria-label="그림판 열기"
          >
            <PencilIcon />
          </S.TabBtn>

          <S.PillDivider />

          <S.ToggleArea>
            <S.ToggleLabel>공개 여부</S.ToggleLabel>
            <S.ToggleTrack
              type="button"
              $on={isPublic}
              onClick={() => setIsPublic(!isPublic)}
              aria-label="공개 여부 토글"
            >
              <S.ToggleThumb $on={isPublic} />
            </S.ToggleTrack>
          </S.ToggleArea>
        </S.MainPill>
      </S.BarInner>
    </S.BarWrapper>
  );
}
