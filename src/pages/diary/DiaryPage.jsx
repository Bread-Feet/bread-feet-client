import { useState } from "react";
import styled from "styled-components";

import DiaryEditorForm from "../../components/diary/DiaryEditorForm";
import TopRightControls from "../../components/diary/TopRightControls";

export default function DiaryPage() {
  const [fontFamily, setFontFamily] = useState("Pretendard");

  return (
    <Screen>
      <Content>
        <TopRightControls onSelectFont={setFontFamily} />
        <DiaryEditorForm fontFamily={fontFamily} />
      </Content>
    </Screen>
  );
}

export const Screen = styled.main`
  position: relative;
  width: 100%;
  box-sizing: border-box;
`;

export const Content = styled.div`
  width: 100%;
  margin: 0 auto;
`;
