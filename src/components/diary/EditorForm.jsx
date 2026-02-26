import * as S from "./EditorForm.styled";
import DiaryDateBox from "./fields/DiaryDateBox";
import DiaryTitleFild from "./fields/DiaryTitleField";
import DiaryContentField from "./fields/DiaryContentField";
import AddStickerButton from "./AddStickerButton";
import StickerPickerModal from "./StickerPickerModal";
import MediaCanvas from "./MediaCanvas";

export default function DiaryEditorFrom() {
  return (
    <>
      <DiaryDateBox />
      <DiaryTitleFild />
      <MediaCanvas />
      <AddStickerButton />
      <StickerPickerModal />
      <DiaryContentField />
    </>
  );
}
