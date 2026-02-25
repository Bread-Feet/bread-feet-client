import { useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import PageLayout from "../../components/layout/PageLayout";

import { useDiaryEditorStore } from "../../store/diaryEditorStore";
import DiaryHeader from "../../components/diary/EditorHeader";
import DiaryEditorForm from "../../components/diary/EditorForm";

function isValidYYYYMMDD(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}` === dateStr;
}

export default function DiaryEditorPage() {
  const { search } = useLocation();
  const setDate = useDiaryEditorStore((s) => s.setDate);

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

  if (!isValid) {
    return (
      <PageLayout
        frameStyle={`align-items: stretch; background: #FFFCF5
    `}
      >
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
        <DiaryHeader />
        <DiaryEditorForm />
      </Content>
    </PageLayout>
  );
}

const Content = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  padding: 16px;
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
