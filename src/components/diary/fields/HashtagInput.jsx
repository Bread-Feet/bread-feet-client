import { useMemo, useState } from "react";
import * as S from "./HashtagInput.styled";
import * as F from "../DiaryEditorForm.styled";

export default function HashtagInput({
  value,
  onChange,
  placeholder = "#겉바속촉 #크루아상",
  maxCount = 10,
}) {
  const [text, setText] = useState("");

  const tags = useMemo(() => (Array.isArray(value) ? value : []), [value]);

  const normalize = (raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return "";
    return trimmed.startsWith("#") ? trimmed.slice(1).trim() : trimmed;
  };

  const addTag = () => {
    const tag = normalize(text);
    if (!tag) return;

    if (tags.includes(tag)) {
      setText("");
      return;
    }

    if (tags.length >= maxCount) return;

    onChange?.([...tags, tag]);
    setText("");
  };

  const removeTag = (tag) => {
    onChange?.(tags.filter((t) => t !== tag));
  };

  return (
    <F.Field>
      <F.Label>해시태그</F.Label>

      <F.Input
        value={text}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          addTag();
        }}
      />

      <S.ChipWrap>
        {tags.map((tag) => (
          <S.Chip key={tag} type="button" onClick={() => removeTag(tag)}>
            #{tag} <span aria-hidden>X</span>
          </S.Chip>
        ))}
      </S.ChipWrap>
    </F.Field>
  );
}
