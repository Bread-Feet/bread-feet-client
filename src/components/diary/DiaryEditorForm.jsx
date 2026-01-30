import { useState } from "react";
import * as S from "./DiaryEditorForm.styled";

export default function DiaryEditorForm({ fontFamily }) {
  const [form, setForm] = useState({
    address: "",
    title: "",
    visitedDate: "",
    content: "",
    pictureUrl: "",
    hashtag: [],
  });

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit payload: ", form);
  };

  return (
    <S.Form style={{ fontFamily }} onSubmit={handleSubmit}>
      <S.Field>
        <S.Label>빵집</S.Label>

        <S.Row>
          <S.Input
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="예) 대전 성심당"
          />
          <S.GhostButton type="button" onClick={() => console.log("검색 열기")}>
            찾기
          </S.GhostButton>
        </S.Row>
      </S.Field>

      <S.Field>
        <S.Label>제목</S.Label>
        <S.Input
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="제목을 입력해주세요"
        />
      </S.Field>

      <S.Field>
        <S.Label>방문 날짜</S.Label>
        <S.Input
          type="date"
          value={form.visitedDate}
          onChange={(e) => updateField("visitedDate", e.target.value)}
        />
      </S.Field>

      <S.Field>
        <S.Label>배경 이미지</S.Label>

        <S.Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            updateField("pictureUrl", url);
          }}
        />

        {form.pictureUrl ? (
          <S.PreviewImage src={form.pictureUrl} alt="preview" />
        ) : null}
      </S.Field>

      <S.Field>
        <S.Label>내용</S.Label>
        <S.Textarea
          rows={6}
          value={form.content}
          onChange={(e) => updateField("content", e.target.value)}
          placeholder="오늘 맛본 빵과 빵집의 분위기는 어떠셨나요?"
        />
      </S.Field>

      <S.Field>
        <S.Label>해시태그</S.Label>

        <S.Input
          placeholder="#달달 #크루아상"
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();

            const raw = e.currentTarget.value.trim();
            if (!raw) return;

            const tag = raw.startsWith("#") ? raw.slice(1) : raw;
            if (!tag) return;

            setForm((prev) => {
              if (prev.hashtag.includes(tag)) return prev;
              return { ...prev, hashtag: [...prev.hashtag, tag] };
            });

            e.currentTarget.value = "";
          }}
        />

        <S.ChipWrap>
          {form.hashtag.map((tag) => (
            <S.Chip
              key={tag}
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  hashtag: prev.hashtag.filter((t) => t !== tag),
                }))
              }
            >
              #{tag} ✕
            </S.Chip>
          ))}
        </S.ChipWrap>
      </S.Field>

      <S.SubmitButton type="submit">등록</S.SubmitButton>
    </S.Form>
  );
}
