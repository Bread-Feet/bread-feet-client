import React, { useEffect, useMemo, useRef } from "react";
import * as S from "./MediaCanvas.styled";
import { useDiaryEditorStore } from "../../store/diaryEditorStore";

const CANVAS_W = 330;
const CANVAS_H = 235;

function drawStrokeOnCtx(ctx, stroke) {
  const { points, tool, color, size } = stroke;
  if (points.length < 2) return;

  ctx.save();
  ctx.lineWidth = size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = color;
  }

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
  ctx.restore();
}

export default function MediaCanvas() {
  const inputRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const currentPointsRef = useRef([]);

  const baseImage = useDiaryEditorStore((s) => s.baseImage);
  const setBaseImage = useDiaryEditorStore((s) => s.setBaseImage);
  const strokes = useDiaryEditorStore((s) => s.strokes);
  const addStroke = useDiaryEditorStore((s) => s.addStroke);
  const tool = useDiaryEditorStore((s) => s.tool);
  const color = useDiaryEditorStore((s) => s.color);
  const brushSize = useDiaryEditorStore((s) => s.brushSize);
  const activeTab = useDiaryEditorStore((s) => s.activeTab);

  const isDrawMode = activeTab === "draw";

  const previewUrl = useMemo(() => {
    if (!baseImage) return null;
    if (typeof baseImage === "string") return baseImage;
    return URL.createObjectURL(baseImage);
  }, [baseImage]);

  useEffect(() => {
    if (!baseImage || typeof baseImage === "string") return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [baseImage, previewUrl]);

  // undo/redo 시 전체 재렌더링
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    strokes.forEach((stroke) => drawStrokeOnCtx(ctx, stroke));
  }, [strokes]);

  const getCanvasPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (CANVAS_W / rect.width),
      y: (e.clientY - rect.top) * (CANVAS_H / rect.height),
    };
  };

  const onPointerDown = (e) => {
    if (!isDrawMode) return;
    e.preventDefault();
    isDrawingRef.current = true;
    canvasRef.current.setPointerCapture(e.pointerId);
    currentPointsRef.current = [getCanvasPoint(e)];
  };

  const onPointerMove = (e) => {
    if (!isDrawMode || !isDrawingRef.current) return;
    e.preventDefault();

    const point = getCanvasPoint(e);
    const points = currentPointsRef.current;
    points.push(point);

    if (points.length < 2) return;

    const ctx = canvasRef.current.getContext("2d");
    drawStrokeOnCtx(ctx, {
      tool,
      color,
      size: brushSize,
      points: [points[points.length - 2], points[points.length - 1]],
    });
  };

  const onPointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    const points = currentPointsRef.current;
    if (points.length >= 1) {
      if (points.length === 1) points.push({ ...points[0] });
      addStroke({ tool, color, size: brushSize, points: [...points] });
    }
    currentPointsRef.current = [];
  };

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setBaseImage(file);
    e.target.value = "";
  };

  if (!previewUrl) {
    return (
      <S.EmptyFrame type="button" onClick={() => inputRef.current?.click()}>
        <S.HiddenInput
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onPickFile}
        />
        <S.Placeholder>
          <S.PlaceholderTitle>사진을 추가하세요</S.PlaceholderTitle>
          <S.PlaceholderDesc>
            추가한 사진 위에 그림도 그릴 수 있어요 ✏️
          </S.PlaceholderDesc>
        </S.Placeholder>
      </S.EmptyFrame>
    );
  }

  return (
    <S.Wrapper>
      <S.HiddenInput
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onPickFile}
      />
      <S.DrawingArea>
        <S.BackgroundImage src={previewUrl} alt="배경 이미지" />
        <S.DrawingCanvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          $drawMode={isDrawMode}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        />
        {isDrawMode && (
          <S.DrawModeOverlay>
            <S.DrawModeHint>그림판 모드</S.DrawModeHint>
          </S.DrawModeOverlay>
        )}
      </S.DrawingArea>
    </S.Wrapper>
  );
}
