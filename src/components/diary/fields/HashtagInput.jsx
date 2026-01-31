import { useMemo, useState } from "react";
import * as S from "./HashtagInput.styled";
<<<<<<< HEAD
import * as F from "../DiaryEditorForm.styled";
=======
>>>>>>> 6ad34d6 (refactor: DiaryInput Form UI)

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
<<<<<<< HEAD
    <F.Field>
      <F.Label>해시태그</F.Label>

      <F.Input
=======
    <S.Wrap>
      <S.Label>해시태그</S.Label>
      <S.Input
>>>>>>> 6ad34d6 (refactor: DiaryInput Form UI)
        value={text}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
<<<<<<< HEAD
=======
          if (e.nativeEvent.isComposing) return;
>>>>>>> 6ad34d6 (refactor: DiaryInput Form UI)
          if (e.key !== "Enter") return;
          e.preventDefault();
          addTag();
        }}
      />
<<<<<<< HEAD

      <S.ChipWrap>
        {tags.map((tag) => (
          <S.Chip key={tag} type="button" onClick={() => removeTag(tag)}>
            #{tag} <span aria-hidden>X</span>
          </S.Chip>
        ))}
      </S.ChipWrap>
    </F.Field>
=======
      <S.ChipWrap>
        {tags.map((tag) => (
          <S.Chip key={tag}>
            <S.ChipText>#{tag}</S.ChipText>
            <S.RemoveBtn
              type="button"
              onClick={() => removeTag(tag)}
              aria-lebel={`#${tag} 삭제`}
            >
              ✕
            </S.RemoveBtn>
          </S.Chip>
        ))}
      </S.ChipWrap>
    </S.Wrap>
>>>>>>> 6ad34d6 (refactor: DiaryInput Form UI)
  );
}
