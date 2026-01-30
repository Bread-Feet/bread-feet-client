import styled from "styled-components";
import arrow_left from "/arrow_left.svg";
import plus from "/plus.svg";
import plus_brown from "/plus_brown.svg";
import deleteIcon from "/deleteIcon.svg";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function BakeryRegisterPage() {
  const nav = useNavigate();

  const [hours, setHours] = useState([
    { id: 1, day: "", start: "", end: "" },
    { id: 2, day: "", start: "", end: "" },
  ]);

  const addHourRow = () => {
    setHours((prev) => [
      ...prev,
      { id: Date.now(), day: "", start: "", end: "" },
    ]);
  };

  const updateHour = (id, key, value) => {
    setHours((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [key]: value } : h)),
    );
  };

  const removeHourRow = (id) => {
    setHours((prev) => prev.filter((h) => h.id !== id));
  };

  const TIME_OPTIONS = Array.from(
    { length: 24 },
    (_, h) => `${String(h).padStart(2, "0")}:00`,
  );

  const toMinutes = (t) => {
    const [hh, mm] = t.split(":").map(Number);
    return hh * 60 + mm;
  };

  const [storeTags, setStoreTags] = useState({
    drink: null, //SELL, NO_SELL
    eatIn: null, // POSSIBLE, IMPOSSIBLE
    waiting: null, // ONSITE, ONLINE
    parking: null, // HAVE, NONE
  });

  const setTag = (key, value) => {
    setStoreTags((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  return (
    <Page>
      <PhoneFrame>
        <Header>
          <ActionButton onClick={() => nav("/mybakery")}>
            <Image src={arrow_left} alt="뒤로가기" />
          </ActionButton>
          <Title>빵집 등록하기</Title>
        </Header>
        <Form>
          <FormSection>
            <SectionName>기본 정보</SectionName>
            <Field>
              <Label>빵집 이름</Label>
              <Input placeholder="빵집 이름을 입력해주세요" />
            </Field>
            <Field>
              <Label>주소</Label>
              <AddressRow>
                <Input placeholder="주소를 검색하세요" />
                <SearchButton type="button">검색</SearchButton>
              </AddressRow>
              <Input placeholder="상세 주소를 입력하세요" />
            </Field>
          </FormSection>
          <FormSection>
            <SectionName>연락처 및 사진 정보</SectionName>
            <Field>
              <Label>전화번호</Label>
              <Input placeholder="010-XXXX-XXXX" />
            </Field>
            <Field>
              <Label>웹페이지</Label>
              <Input placeholder="https://www.instagram.com/example" />
            </Field>
            <Field>
              <Label>대표사진</Label>
              <PhotoBox>
                <Plus src={plus} alt="대표사진 추가" />
              </PhotoBox>
            </Field>
          </FormSection>
          <FormSection>
            <SectionName>상세 운영 정보</SectionName>
            <TimeRow>
              <Label>운영 시간</Label>
              <InlineAction type="button" onClick={addHourRow}>
                <Plus src={plus_brown} alt="시간 추가" />
                <span>시간 추가</span>
              </InlineAction>
            </TimeRow>
            <HoursList>
              {hours.map((h) => (
                <HoursRow key={h.id}>
                  <SelectBox
                    required
                    value={h.day || ""}
                    onChange={(e) => updateHour(h.id, "day", e.target.value)}
                  >
                    <option value="" disabled>
                      요일 선택
                    </option>
                    {[
                      "월요일",
                      "화요일",
                      "수요일",
                      "목요일",
                      "금요일",
                      "토요일",
                      "일요일",
                    ].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </SelectBox>
                  <TimeRange>
                    <TimeSelect
                      required
                      value={h.start || ""}
                      onChange={(e) => {
                        const start = e.target.value;
                        updateHour(h.id, "start", start);

                        // start 바꾸면 end가 start보다 이르면 end 초기화
                        if (h.end && toMinutes(h.end) <= toMinutes(start)) {
                          updateHour(h.id, "end", "");
                        }
                      }}
                    >
                      <option value="" disabled>
                        시작
                      </option>
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </TimeSelect>
                    <TimeSelect
                      required
                      value={h.end || ""}
                      disabled={!h.start}
                      onChange={(e) => updateHour(h.id, "end", e.target.value)}
                    >
                      <option value="" disabled>
                        마감
                      </option>
                      {TIME_OPTIONS.filter(
                        (t) => !h.start || toMinutes(t) > toMinutes(h.start),
                      ).map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </TimeSelect>
                    <HoursDeleteButton
                      type="button"
                      onClick={() => removeHourRow(h.id)}
                    >
                      <DeleteImg src={deleteIcon} alt="삭제" />
                    </HoursDeleteButton>
                  </TimeRange>
                  <SelectedTimeText>
                    {h.start && h.end
                      ? `${h.start}-${h.end}`
                      : "시간을 선택하세요"}
                  </SelectedTimeText>
                </HoursRow>
              ))}
            </HoursList>
          </FormSection>
          <FormSection>
            <SectionName>매장 관리</SectionName>
            <StoreTagGrid>
              <StoreTag
                type="button"
                $active={storeTags.drink === "SELL"}
                onClick={() => setTag("drink", "SELL")}
              >
                음료 판매
              </StoreTag>
              <StoreTag
                type="button"
                $active={storeTags.drink === "NO_SELL"}
                onClick={() => setTag("drink", "NO_SELL")}
              >
                음료 미판매
              </StoreTag>
              <StoreTag
                type="button"
                $active={storeTags.eatIn === "POSSIBLE"}
                onClick={() => setTag("eatIn", "POSSIBLE")}
              >
                매장 취식 가능
              </StoreTag>
              <StoreTag
                type="button"
                $active={storeTags.eatIn === "IMPOSSIBLE"}
                onClick={() => setTag("eatIn", "IMPOSSIBLE")}
              >
                매장 취식 불가능
              </StoreTag>
              <StoreTag
                type="button"
                $active={storeTags.waiting === "ONSITE"}
                onClick={() => setTag("waiting", "ONSITE")}
              >
                현장 웨이팅
              </StoreTag>
              <StoreTag
                type="button"
                $active={storeTags.waiting === "ONLINE"}
                onClick={() => setTag("waiting", "ONLINE")}
              >
                온라인 웨이팅
              </StoreTag>
              <StoreTag
                type="button"
                $active={storeTags.parking === "HAVE"}
                onClick={() => setTag("parking", "HAVE")}
              >
                전용 주차장 보유
              </StoreTag>
              <StoreTag
                type="button"
                $active={storeTags.parking === "NONE"}
                onClick={() => setTag("parking", "NONE")}
              >
                전용 주차장 미보유
              </StoreTag>
            </StoreTagGrid>
          </FormSection>
          <FormSection>
            <SectionName>메뉴 정보</SectionName>
            <AddWrapper>
              <InlineAction type="button" onClick={() => {}}>
                <Plus src={plus_brown} alt="메뉴 추가" />
                <span>메뉴 추가</span>
              </InlineAction>
            </AddWrapper>
            <MenuAddRow>
              <MenuPhotoBox type="button" aria-label="메뉴 사진 추가">
                <PlusSmaller src={plus} alt="추가하기" />
              </MenuPhotoBox>
              <MenuInputColumn>
                <SmallInput placeholder="메뉴 이름" />
                <SmallInput placeholder="가격" />
              </MenuInputColumn>
            </MenuAddRow>
          </FormSection>
        </Form>
      </PhoneFrame>
    </Page>
  );
}

const Page = styled.main`
  min-height: var(--app-100vh);
  height: var(--app-100vh);
  background: var(--main-color4);

  display: flex;
  align-items: center;
  justify-content: center;

  /* pwa iOS safe area */
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
`;

const PhoneFrame = styled.section`
  width: min(402px, 100vw);
  height: var(--app-100vh);

  max-height: var(--app-100vh);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const Header = styled.header`
  width: 100%;

  background: var(--main-color4);
  padding: 58px var(--page-padding) 10px var(--page-padding);
  border-bottom: solid 1px #d9d9d9;

  display: grid;
  grid-template-columns: 48px 1fr 48px;
  align-items: center;
  justify-items: center;
`;

const ActionButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
`;

const Image = styled.img``;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;

  margin: 0;
`;

const Form = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  overflow-y: auto;
  /* padding-bottom: var(--tabbar-height); */

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #000000;
    border-radius: 999px;
  }
`;

const FormSection = styled.div`
  margin: 10px;
`;

const SectionName = styled.h2`
  font-size: 12px;
  color: var(--main-color2);

  margin: 3px 0 0 0;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;

  padding: 0 8px;
  margin: 20px 0 0 0;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #111;
`;

const Input = styled.input`
  font-size: 16px;

  width: 100%;
  height: 56px;

  background: #f8f9fa;
  border: solid 1px #e8ebf1;
  border-radius: 20px;

  padding: 0 20px;
  margin: 5px 0;

  outline: none;

  &:focus {
    outline: solid 2px var(--main-color2);
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  }

  &::placeholder {
    color: #a5a5a5;
  }
`;

const AddressRow = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;

  margin-bottom: 1px;
`;

const SearchButton = styled.button`
  font-size: 16px;
  font-weight: 400;
  color: var(--main-color4);

  flex: 0 0 86px;
  height: 56px;

  background: var(--main-color2);
  border: none;
  border-radius: 20px;

  cursor: pointer;
`;

const PhotoBox = styled.button`
  width: 135px;
  height: 135px;

  border-radius: 20px;
  border: dashed 0.5px #e8ebf1;
  background: #f8f9fa;

  margin: 5px 0;

  display: grid;
  place-items: center;

  cursor: pointer;
`;

const Plus = styled.img``;

const TimeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 8px;
  margin: 20px 0 0 0;
`;

const InlineAction = styled.button`
  font-size: 14px;
  font-weight: 600;
  color: var(--main-color2);

  border: none;
  background: transparent;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const HoursList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;

  margin: 5px 0;
`;

const HoursRow = styled.div`
  display: grid;
  grid-template-columns: 136px 1fr;
  gap: 3px;

  padding: 0 8px;
`;

const SelectBox = styled.select`
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  &:invalid {
    font-weight: 400;
    color: #a5a5a5;
  }
  height: 56px;
  border-radius: 20px;
  border: 1px solid #e8ebf1;
  background: #f8f9fa;
  outline: none;

  padding: 0 15px;

  cursor: pointer;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  background-image: url("/dropboxIcon.svg");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 18px 18px;
`;

const TimeRange = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 24px;
  align-items: center;
  gap: 8px;
`;

const SelectedTimeText = styled.div`
  margin: 6px 8px 0 8px;
  font-size: 12px;
  color: #777;
`;

const TimeSelect = styled.select`
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  &:invalid {
    font-weight: 400;
    color: #a5a5a5;
  }

  width: 100%;
  min-width: 0;
  height: 56px;

  border-radius: 20px;
  border: 1px solid #e8ebf1;
  background: #f8f9fa;
  outline: none;

  padding: 0 15px;

  cursor: pointer;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  background-image: url("/dropboxIcon.svg");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 18px 18px;
`;

const Option = styled.option``;

const HoursDeleteButton = styled.button`
  border: none;
  background: transparent;

  padding: 0;

  cursor: pointer;
`;

const DeleteImg = styled.img``;

const StoreTagGrid = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const StoreTag = styled.button`
  font-size: 16px;

  height: 56px;
  border-radius: 20px;

  border: ${(p) =>
    p.$active ? "1px solid var(--main-color2)" : "1px solid #e8ebf1"};
  background: ${(p) => (p.$active ? "var(--main-color2)" : "#f8f9fa")};
  color: ${(p) => (p.$active ? "var(--main-color4)" : "#a5a5a5")};

  cursor: pointer;
`;

const AddWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const MenuAddRow = styled.div`
  margin-top: 10px;

  display: flex;
  gap: 4px;
`;

const MenuPhotoBox = styled.button`
  width: 116px;
  height: 116px;

  border-radius: 20px;
  border: dashed 0.5px #e8ebf1;
  background: #f8f9fa;

  cursor: pointer;
`;

const PlusSmaller = styled.img`
  width: 35px;
`;

const MenuInputColumn = styled.div`
  flex: 1px;
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const SmallInput = styled.input`
  font-size: 16px;

  width: 100%;
  height: 56px;

  background: #f8f9fa;
  border: solid 1px #e8ebf1;
  border-radius: 20px;

  padding: 0 20px;

  outline: none;

  &:focus {
    outline: solid 2px var(--main-color2);
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  }

  &::placeholder {
    color: #a5a5a5;
  }
`;
