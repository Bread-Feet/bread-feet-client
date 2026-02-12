import styled from "styled-components";
const left_arrow = "/arrow_left_black.svg";
const PlusIcon = "/plus.svg";

import PageLayout from "../../components/layout/PageLayout";

import { useNavigate } from "react-router-dom";

const MAX_LEN = 299;
const MAX_PHOTOS = 5;

export default function BakeryReviewPage() {
  const nav = useNavigate();

  return (
    <PageLayout>
      <TopBar>
        <BackBtn type="button" onClick={() => nav(-1)} aria-label="뒤로가기">
          <Arrow src={left_arrow} />
        </BackBtn>
        <Title>리뷰 등록하기</Title>
        <RightSpace />
      </TopBar>

      <ReviewWrapper>
        <Body>
          <TextAreaCard>
            <TextArea maxLength={MAX_LEN} placeholder="리뷰를 작성해주세요" />
          </TextAreaCard>
          <Counter>0 / {MAX_LEN}</Counter>

          <PhotoRow>
            <PhotoInputBox>
              <PlusImg src={PlusIcon} />
            </PhotoInputBox>
            <PhotoInput type="file" accept="image/*" />
            <PhotoWrapper>
              {Array.from({ length: MAX_PHOTOS }).map((_, i) => {
                return <PhotoBox key={i}></PhotoBox>;
              })}
            </PhotoWrapper>
          </PhotoRow>
        </Body>
      </ReviewWrapper>

      <BottomBar>
        <SubmitBtn type="button">완료</SubmitBtn>
      </BottomBar>
    </PageLayout>
  );
}

const ReviewWrapper = styled.div`
  width: 100%;
  flex: 1;

  padding: 16px;
`;

const TopBar = styled.header`
  width: 100%;

  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  border-bottom: 1px solid #f2f2f2;
  background: transparent;

  padding: 53px var(--page-padding) 10px var(--page-padding);
`;

const BackBtn = styled.button`
  border: 0;
  background: transparent;
  border-radius: 10px;
  display: grid;
  justify-content: center;
  place-items: center;

  padding: 5px;

  cursor: pointer;
`;

const Arrow = styled.img`
  width: 36px;
  height: 36px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #000000;

  text-align: center;

  margin: 0;
`;

const RightSpace = styled.div``;

const Body = styled.div`
  width: 100%;
`;

const TextAreaCard = styled.div`
  height: 360px;

  border: 1px solid #e8ebf1;
  border-radius: 20px;
  background: #f8f9fa;

  padding: 24px;
`;

const TextArea = styled.textarea`
  font-size: 16px;
  line-height: 20px;
  color: #000000;

  width: 100%;
  height: 100%;

  resize: none;
  border: 0;
  outline: 0;
  background: transparent;

  padding: 0;

  &::placeholder {
    color: #b9b9b9;
  }
`;

const Counter = styled.div`
  font-size: 16px;
  color: #a5a5a5;
  text-align: right;

  margin: 8px 0;
`;

const PhotoRow = styled.div`
  height: 135px;

  display: grid;
  grid-template-columns: 135px 1fr;
  gap: 8px;
`;

const PhotoInput = styled.input`
  display: none;
`;

const PhotoInputBox = styled.button`
  width: 135px;
  height: 135px;

  border: solid 1px #e8ebf1;
  border-radius: 20px;
  background: #f8f9fa;

  padding: 0;

  cursor: pointer;
`;

const PlusImg = styled.img``;

const PhotoWrapper = styled.div`
  min-width: 0;

  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
`;

const PhotoBox = styled.button`
  flex: 0 0 120px;

  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;

  border: 1px solid #e9e9e9;
  border-radius: 20px;
  background: #fff;
`;

const BottomBar = styled.div`
  width: 100%;

  padding: 0 16px 24px;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
`;

const SubmitBtn = styled.button`
  font-size: 16px;
  font-weight: 600;

  width: 100%;
  color: var(--main-color4);

  border: 0;
  border-radius: 20px;
  background: var(--main-color2);

  padding: 15px 0;

  cursor: pointer;
`;
