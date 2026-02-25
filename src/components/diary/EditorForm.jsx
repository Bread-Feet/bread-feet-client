import * as S from "./EditorForm.styled";
import DiaryDateBox from "./fields/DiaryDateBox";
import DiaryTitleFild from "./fields/DiaryTitleField";
import DiaryContentField from "./fields/DiaryContentField";
import MediaCanvas from "./MediaCanvas";

export default function DiaryEditorFrom() {
  return (
    <>
      <DiaryDateBox />
      <DiaryTitleFild />
      <MediaCanvas />
      <DiaryContentField />
    </>
  );
}
