import { useMemo, useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import PageLayout from "../../components/layout/PageLayout";

import { useDiaryEditorStore } from "../../store/diaryEditorStore";
import DiaryHeader from "../../components/diary/EditorHeader";
import DiaryEditorForm from "../../components/diary/EditorForm";
import EditorTabBar from "../../components/diary/EditorTabBar";
import { createDiary } from "../../lib/api/diary";
import { uploadReviewPhoto } from "../../lib/api/imgUpload";

function isValidYYYYMMDD(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}` === dateStr;
}

function toVisitDateISOString(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toISOString();
}

function normalizeAddress(address) {
  return {
    detail: address?.detail ?? "",
    lotNumber: address?.lotNumber ?? "",
    roadAddress: address?.roadAddress ?? "",
  };
}

export default function DiaryEditorPage() {
  const { search } = useLocation();
  const navigate = useNavigate();

  const setDate = useDiaryEditorStore((s) => s.setDate);
  const resetEditor = useDiaryEditorStore((s) => s.resetEditor);
  const diaryDate = useDiaryEditorStore((s) => s.date);
  const bakery = useDiaryEditorStore((s) => s.bakery);
  const title = useDiaryEditorStore((s) => s.title);
  const content = useDiaryEditorStore((s) => s.content);
  const isPublic = useDiaryEditorStore((s) => s.isPublic);
  const baseImage = useDiaryEditorStore((s) => s.baseImage);
  const strokes = useDiaryEditorStore((s) => s.strokes);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { dateStr, isValid } = useMemo(() => {
    const params = new URLSearchParams(search);
    const q = params.get("date");

    if (!q) return { dateStr: null, isValid: false };
    return { dateStr: q, isValid: isValidYYYYMMDD(q) };
  }, [search]);

  useEffect(() => {
    if (!isValid) return;
    setDate(dateStr);
  }, [isValid, dateStr, setDate]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    if (!diaryDate) {
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

    setIsSubmitting(true);

    try {
      const pictureUrls = [];

      if (typeof baseImage === "string" && baseImage) {
        pictureUrls.push(baseImage);
      } else if (baseImage) {
        const uploadedUrl = await uploadReviewPhoto({ file: baseImage });
        pictureUrls.push(uploadedUrl);
      }

      await createDiary({
        bakeryId: bakery.bakeryId,
        isPublic,
        address: normalizeAddress(bakery.address),
        thumbnail: "",
        title: title.trim(),
        visitDate: toVisitDateISOString(diaryDate),
        content: content.trim(),
        drawingData: JSON.stringify(strokes ?? []),
        hashtags: [],
        pictureUrls,
      });

      resetEditor();
      navigate("/mydiary", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "다이어리 저장에 실패했어요. 다시 시도해주세요.";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    diaryDate,
    bakery,
    title,
    content,
    baseImage,
    strokes,
    isPublic,
    resetEditor,
    navigate,
  ]);

  if (!isValid) {
    return (
      <PageLayout frameStyle={`align-items: stretch; background: #FFFCF5`}>
        <Content>
          <ErrorCard>
            <p>유효하지 않은 날짜로 접근했어요.</p>
            <p>날짜를 다시 선택해주세요.</p>
          </ErrorCard>
        </Content>
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
        <DiaryHeader onSubmit={handleSubmit} isSubmitting={isSubmitting} />
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

const ErrorCard = styled.div`
  width: min(360px, 100%);
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(0, 0, 0, 0.12);

  p {
    margin: 0;
    line-height: 1.5;
  }
  p + p {
    margin-top: 8px;
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
  }
`;
