import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import PageLayout from "../../components/layout/PageLayout";
import { deleteDiary, fetchDiaryDetail } from "../../lib/api/diary";

const BackMark = "/arrow_left_black.svg";
const MapPin = "/location_brown.svg";

const CANVAS_W = 330;
const CANVAS_H = 235;

function formatVisitDate(value) {
  if (!value) return "날짜 정보 없음";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "날짜 정보 없음";
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekday = d.toLocaleDateString("ko-KR", { weekday: "long" });
  return `${month}월 ${day}일 ${weekday}`;
}

function drawStrokeOnCtx(ctx, stroke) {
  const points = Array.isArray(stroke?.points) ? stroke.points : [];
  if (points.length < 2) return;

  ctx.save();
  ctx.lineWidth = stroke?.size ?? 1;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (stroke?.tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = stroke?.color ?? "#000000";
  }

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
  ctx.restore();
}

export default function DiaryDetailPage() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { diaryId } = useParams();
  const canvasRef = useRef(null);

  const [diary, setDiary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const canModify = pathname.startsWith("/diary/");

  useEffect(() => {
    let cancelled = false;

    async function loadDiary() {
      if (!diaryId) return;
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchDiaryDetail(diaryId);
        if (!cancelled) setDiary(data ?? null);
      } catch (err) {
        if (!cancelled) {
          console.error("[DiaryDetailPage]", err);
          setError(err);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadDiary();
    return () => {
      cancelled = true;
    };
  }, [diaryId]);

  const drawingStrokes = useMemo(() => {
    if (!diary?.drawingData) return [];
    try {
      const parsed = JSON.parse(diary.drawingData);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("[DiaryDetailPage] drawingData parse failed", err);
      return [];
    }
  }, [diary?.drawingData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    drawingStrokes.forEach((stroke) => {
      drawStrokeOnCtx(ctx, stroke);
    });
  }, [drawingStrokes]);

  const imageUrl = diary?.pictureUrls?.[0] || diary?.thumbnailUrl || "";

  const handleDelete = async () => {
    if (!diary || isDeleting) return;

    const ok = window.confirm("이 다이어리를 삭제할까요?");
    if (!ok) return;

    setIsDeleting(true);
    try {
      await deleteDiary(diaryId);
      nav("/mydiary", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "삭제에 실패했어요. 다시 시도해주세요.";
      alert(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PageLayout
      frameStyle={`align-items: stretch; background: #FFFCF5; overflow: hidden;`}
    >
      <Screen>
        <Header>
          <BackButton type="button" onClick={() => nav(-1)} aria-label="back">
            <BackIcon src={BackMark} alt="뒤로가기" />
          </BackButton>
          <Title>다이어리</Title>
          <HeaderRight>
            {canModify && (
              <>
                <ActionButton
                  type="button"
                  onClick={() => nav(`/diary/modify/${diaryId}`)}
                >
                  수정
                </ActionButton>
                <ActionButton
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  삭제
                </ActionButton>
              </>
            )}
          </HeaderRight>
        </Header>

        <Main>
          {isLoading && <Message>불러오는 중...</Message>}

          {!isLoading && error && (
            <Message>다이어리를 불러오지 못했어요.</Message>
          )}

          {!isLoading && !error && diary && (
            <>
              <DateBox>
                <DateText>{formatVisitDate(diary.visitDate)}</DateText>
                <Divider />
                <BakeryText>
                  <Pin src={MapPin} alt="" />
                  {diary.bakeryName || "빵집 정보 없음"}
                </BakeryText>
              </DateBox>

              <DiaryTitle>{diary.title || ""}</DiaryTitle>

              <MediaFrame>
                {imageUrl ? (
                  <BackgroundImage src={imageUrl} alt="" />
                ) : (
                  <EmptyLabel>이미지가 없어요</EmptyLabel>
                )}
                <DrawingCanvas
                  ref={canvasRef}
                  width={CANVAS_W}
                  height={CANVAS_H}
                />
              </MediaFrame>

              <ContentBox>{diary.content || ""}</ContentBox>
            </>
          )}
        </Main>
      </Screen>
    </PageLayout>
  );
}

const Screen = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  height: calc(56px + env(safe-area-inset-top, 0px) + 8px);
  padding: calc(env(safe-area-inset-top, 0px) + 8px) 14px 0;
  display: grid;
  grid-template-columns: 84px 1fr 84px;
  align-items: center;
`;

const BackButton = styled.button`
  width: 36px;
  height: 36px;
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 0;
  justify-self: start;
`;

const BackIcon = styled.img`
  width: 100%;
  display: block;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
`;

const HeaderRight = styled.div`
  width: 84px;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  justify-self: end;
`;

const ActionButton = styled.button`
  border: 1px solid #ab9d8b;
  background: #ffffff;
  color: #7c4628;
  border-radius: 999px;
  font-size: 11px;
  padding: 4px 8px;
  cursor: pointer;
`;

const Main = styled.main`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Message = styled.p`
  margin: 0;
  text-align: center;
  color: #7a6b58;
  font-size: 14px;
`;

const DateBox = styled.div`
  width: 100%;
  height: 48px;
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  align-items: center;
  align-content: center;
  border-radius: 10px;
  border: 1px solid #ab9d8b;
`;

const DateText = styled.div`
  padding: 0 14px;
  font-size: 14px;
  color: #000000;
  white-space: nowrap;
`;

const Divider = styled.div`
  width: 1px;
  height: 60px;
  background-color: #ab9d8b;
`;

const BakeryText = styled.div`
  padding-left: 14px;
  font-size: 13px;
  color: #000000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Pin = styled.img`
  width: 16px;
  height: 15px;
  margin-right: 6px;
  vertical-align: middle;
`;

const DiaryTitle = styled.h2`
  margin: 0;
  padding: 0 12px;
  font-size: 22px;
  color: #ab9d8b;
  font-weight: 500;
`;

const MediaFrame = styled.div`
  position: relative;
  width: 330px;
  max-width: 100%;
  height: 235px;
  margin: 0 auto;
  border-radius: 10px;
  border: 1.5px solid #ab9d8b;
  overflow: hidden;
  background: #ffffff;
`;

const BackgroundImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const EmptyLabel = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: #ab9d8b;
  font-size: 13px;
`;

const DrawingCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const ContentBox = styled.pre`
  margin: 0;
  width: 100%;
  min-height: 200px;
  padding: 6px 8px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 16px;
  line-height: 36px;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 34.5px,
    #ab9d8b 34.5px,
    #ab9d8b 36px
  );
`;
