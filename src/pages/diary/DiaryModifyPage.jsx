import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import PageLayout from "../../components/layout/PageLayout";
import DiaryHeader from "../../components/diary/EditorHeader";
import DiaryEditorForm from "../../components/diary/EditorForm";
import EditorTabBar from "../../components/diary/EditorTabBar";
import { useDiaryEditorStore } from "../../store/diaryEditorStore";
import { fetchDiaryDetail, updateDiary } from "../../lib/api/diary";
import { uploadReviewPhoto } from "../../lib/api/imgUpload";

function toUtcMidnightISOString(dateStr) {
  const [yyyy, mm, dd] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(yyyy, mm - 1, dd)).toISOString();
}

function normalizeAddress(address) {
  return {
    detail: address?.detail ?? "",
    lotNumber: address?.lotNumber ?? "",
    roadAddress: address?.roadAddress ?? "",
  };
}

export default function DiaryModifyPage() {
  const nav = useNavigate();
  const { diaryId } = useParams();

  const resetEditor = useDiaryEditorStore((s) => s.resetEditor);
  const setDate = useDiaryEditorStore((s) => s.setDate);
  const setBakery = useDiaryEditorStore((s) => s.setBakery);
  const setTitle = useDiaryEditorStore((s) => s.setTitle);
  const setContent = useDiaryEditorStore((s) => s.setContent);
  const setIsPublic = useDiaryEditorStore((s) => s.setIsPublic);
  const setBaseImage = useDiaryEditorStore((s) => s.setBaseImage);
  const setStrokes = useDiaryEditorStore((s) => s.setStrokes);

  const date = useDiaryEditorStore((s) => s.date);
  const bakery = useDiaryEditorStore((s) => s.bakery);
  const title = useDiaryEditorStore((s) => s.title);
  const content = useDiaryEditorStore((s) => s.content);
  const isPublic = useDiaryEditorStore((s) => s.isPublic);
  const baseImage = useDiaryEditorStore((s) => s.baseImage);
  const strokes = useDiaryEditorStore((s) => s.strokes);

  const [loadedDiary, setLoadedDiary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadDiary() {
      if (!diaryId) return;
      setIsLoading(true);
      setLoadError(null);

      try {
        const data = await fetchDiaryDetail(diaryId);
        if (cancelled) return;

        setLoadedDiary(data ?? null);
        resetEditor();

        const visitDate = (data?.visitDate || "").slice(0, 10);
        if (visitDate) setDate(visitDate);

        setBakery({
          bakeryId: data?.bakeryId ?? null,
          name: data?.bakeryName ?? "",
          address: data?.address ?? {
            detail: "",
            lotNumber: "",
            roadAddress: "",
          },
        });

        setTitle(data?.title ?? "");
        setContent(data?.content ?? "");
        setIsPublic(!!data?.isPublic);

        const mainImage = data?.pictureUrls?.[0] || data?.thumbnailUrl || null;
        if (mainImage) setBaseImage(mainImage);

        if (data?.drawingData) {
          try {
            const parsed = JSON.parse(data.drawingData);
            setStrokes(Array.isArray(parsed) ? parsed : []);
          } catch {
            setStrokes([]);
          }
        } else {
          setStrokes([]);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[DiaryModifyPage]", err);
          setLoadError(err);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadDiary();

    return () => {
      cancelled = true;
    };
  }, [
    diaryId,
    resetEditor,
    setDate,
    setBakery,
    setTitle,
    setContent,
    setIsPublic,
    setBaseImage,
    setStrokes,
  ]);

  const resolvedDiaryId = useMemo(() => {
    if (loadedDiary?.id != null) return loadedDiary.id;
    if (diaryId == null) return null;
    const n = Number(diaryId);
    return Number.isFinite(n) ? n : diaryId;
  }, [loadedDiary?.id, diaryId]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    if (!date) {
      alert("방문 날짜를 먼저 선택해주세요.");
      return;
    }

    if (!bakery?.bakeryId || !bakery?.name) {
      alert("빵집을 먼저 선택해주세요.");
      return;
    }

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (resolvedDiaryId == null) {
      alert("수정할 다이어리 ID를 확인할 수 없어요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const pictureUrls = [];

      if (typeof baseImage === "string" && baseImage) {
        pictureUrls.push(baseImage);
      } else if (baseImage) {
        const uploadedUrl = await uploadReviewPhoto({ file: baseImage });
        pictureUrls.push(uploadedUrl);
      }

      await updateDiary(resolvedDiaryId, {
        isPublic,
        address: normalizeAddress(bakery.address),
        thumbnail: "",
        title: title.trim(),
        bakeryId: bakery.bakeryId,
        visitDate: toUtcMidnightISOString(date),
        content: content.trim(),
        drawingData: JSON.stringify(strokes ?? []),
        hashtags: [],
        pictureUrls,
      });

      resetEditor();
      nav(`/diary/${resolvedDiaryId}`, { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "수정에 실패했어요. 다시 시도해주세요.";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    date,
    bakery,
    title,
    content,
    resolvedDiaryId,
    baseImage,
    isPublic,
    strokes,
    resetEditor,
    nav,
  ]);

  if (isLoading) {
    return (
      <PageLayout frameStyle={`align-items: stretch; background: #FFFCF5`}>
        <LoadingBox>불러오는 중...</LoadingBox>
      </PageLayout>
    );
  }

  if (loadError || !loadedDiary) {
    return (
      <PageLayout frameStyle={`align-items: stretch; background: #FFFCF5`}>
        <LoadingBox>다이어리를 불러오지 못했어요.</LoadingBox>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      frameStyle={`align-items: stretch; background: #FFFCF5;
        overflow: hidden;
    `}
    >
      <Content>
        <DiaryHeader title="다이어리 수정" onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        <DiaryEditorForm />
      </Content>
      <EditorTabBar />
    </PageLayout>
  );
}

const Content = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  padding: 16px;
  padding-bottom: calc(100px + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
`;

const LoadingBox = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: #7a6b58;
  font-size: 14px;
`;
