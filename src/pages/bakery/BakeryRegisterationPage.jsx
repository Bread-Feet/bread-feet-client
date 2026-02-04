import styled from "styled-components";
import arrow_left from "/arrow_left.svg";
import plus from "/plus.svg";
import plus_brown from "/plus_brown.svg";
import deleteIcon from "/deleteIcon.svg";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function BakeryRegisterPage() {
  const nav = useNavigate();

  const [bakeryName, setBakeryName] = useState("");
  const handleBakeryNameChange = (e) => {
    setBakeryName(e.target.value);
  };

  const [address, setAddress] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const handleDetailedAddressChange = (e) => {
    setDetailedAddress(e.target.value);
  };

  const [phoneNumber, setPhoneNumber] = useState("");
  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const [webpage, setWebpage] = useState("");
  const handleWebpageChange = (e) => {
    setWebpage(e.target.value);
  };

  const [mainPhoto, setMainPhoto] = useState(null);
  const [mainPhotoPreview, setMainPhotoPreview] = useState(null);

  const handleMainPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있어요.");
      e.target.value = "";
      return;
    }

    // 이전 미리보기 url 해제
    setMainPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    setMainPhoto(file);
  };

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
    { length: 25 },
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

  const [draftMenuPhotoPreview, setDraftMenuPhotoPreview] = useState(null);
  const [menus, setMenus] = useState([
    { id: 1, name: "소금빵", price: 2800, isMain: true, photoPreview: null },
    { id: 2, name: "크림빵", price: 4500, isMain: false, photoPreview: null },
  ]);

  // 메뉴 추가용 임시 상태
  const [newMenu, setNewMenu] = useState({
    name: "",
    price: "",
    photoPreview: null,
  });

  const handleDraftMenuPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있어요.");
      e.target.value = "";
      return;
    }

    // 이전 미리보기 url 해제
    setDraftMenuPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    setNewMenu((p) => ({ ...p, photoPreview: URL.createObjectURL(file) }));
  };

  const addMenu = () => {
    if (!newMenu.name.trim()) return;
    const priceNum = Number(newMenu.price);
    setMenus((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newMenu.name.trim(),
        price: Number.isFinite(priceNum) ? priceNum : 0,
        isMain: prev.length === 0,
        photoPreview: newMenu.photoPreview,
      },
    ]);

    setDraftMenuPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });

    setNewMenu({ name: "", price: "", photoPreview: null });
  };

  const removeMenu = (id) => {
    setMenus((prev) => prev.filter((m) => m.id !== id));
  };

  const setMainMenu = (id) => {
    setMenus((prev) => prev.map((m) => ({ ...m, isMain: m.id === id })));
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
              <Input
                placeholder="빵집 이름을 입력해주세요"
                onChange={(e) => {
                  handleBakeryNameChange(e);
                }}
              />
            </Field>
            <Field>
              <Label>주소</Label>
              <AddressRow>
                <Input placeholder="주소를 검색하세요" />
                <SearchButton type="button">검색</SearchButton>
              </AddressRow>
              <Input
                placeholder="상세 주소를 입력하세요"
                onChange={(e) => {
                  handleDetailedAddressChange(e);
                }}
              />
            </Field>
          </FormSection>
          <FormSection>
            <SectionName>연락처 및 사진 정보</SectionName>
            <Field>
              <Label>전화번호</Label>
              <Input
                placeholder="010-XXXX-XXXX"
                onChange={(e) => handlePhoneNumberChange(e)}
              />
            </Field>
            <Field>
              <Label>웹페이지</Label>
              <Input
                placeholder="https://www.instagram.com/example"
                onChange={(e) => handleWebpageChange(e)}
              />
            </Field>
            <Field>
              <Label>대표사진</Label>
              <PhotoBox>
                {mainPhotoPreview ? (
                  <PreviewImg src={mainPhotoPreview} alt="대표사진 미리보기" />
                ) : (
                  <Plus src={plus} alt="대표사진 추가" />
                )}
                <PhotoInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleMainPhotoChange(e)}
                />
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
            <TimeText>시작 시간을 먼저 선택해주세요</TimeText>
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
                    <DeleteButton
                      type="button"
                      onClick={() => removeHourRow(h.id)}
                    >
                      <DeleteImg src={deleteIcon} alt="삭제" />
                    </DeleteButton>
                  </TimeRange>
                </HoursRow>
              ))}
            </HoursList>
          </FormSection>
          <FormSection>
            <Label>매장 관리</Label>
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
              <InlineAction type="button" onClick={addMenu}>
                <Plus src={plus_brown} alt="메뉴 추가" />
                <span>메뉴 추가</span>
              </InlineAction>
            </AddWrapper>
            <MenuAddRow>
              <MenuPhotoBox
                type="button"
                onClick={() => {}}
                aria-label="메뉴 사진 추가"
              >
                {draftMenuPhotoPreview ? (
                  <PreviewImg
                    src={draftMenuPhotoPreview}
                    alt="대표사진 미리보기"
                  />
                ) : (
                  <PlusSmaller src={plus} alt="추가하기" />
                )}
                <PhotoInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleDraftMenuPhotoChange(e)}
                />
              </MenuPhotoBox>
              <MenuInputColumn>
                <SmallInput
                  placeholder="메뉴 이름"
                  value={newMenu.name}
                  onChange={(e) =>
                    setNewMenu((p) => ({ ...p, name: e.target.value }))
                  }
                />
                <SmallInput
                  placeholder="가격"
                  inputMode="numeric"
                  value={newMenu.price}
                  onChange={(e) =>
                    setNewMenu((p) => ({ ...p, price: e.target.value }))
                  }
                />
              </MenuInputColumn>
            </MenuAddRow>
            <Label>메뉴 관리</Label>
            <MenuList>
              {menus.map((m) => (
                <MenuCard key={m.id}>
                  <MenuThumb>
                    <MenuThumbImg src={m.photoPreview || undefined} />
                  </MenuThumb>
                  <MenuInfo>
                    <MenuNameRow>
                      <MenuName>{m.name}</MenuName>
                      {m.isMain ? (
                        <Badge>대표</Badge>
                      ) : (
                        <BadgeButton
                          type="button"
                          onClick={() => setMainMenu(m.id)}
                        >
                          대표 설정
                        </BadgeButton>
                      )}
                    </MenuNameRow>
                    <MenuPrice>{m.price.toLocaleString()}원</MenuPrice>
                  </MenuInfo>
                  <DeleteButton
                    type="button"
                    onClick={() => removeMenu(m.id)}
                    aria-label="메뉴 삭제"
                  >
                    <DeleteImg src={deleteIcon} alt="삭제" />
                  </DeleteButton>
                </MenuCard>
              ))}
            </MenuList>
          </FormSection>
          <SubmitButton>완료</SubmitButton>
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
  margin: 12px 16px;
`;

const SectionName = styled.h2`
  font-size: 12px;
  color: var(--main-color2);

  margin: 8px 8px 0 8px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0 8px;
  margin: 15px 0 0 0;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #111;

  margin-bottom: 6px;
`;

const Input = styled.input`
  font-size: 16px;

  width: 100%;
  height: 56px;

  background: #f8f9fa;
  border: solid 1px #e8ebf1;
  border-radius: 20px;

  padding: 0 20px;
  margin: 0 0 5px 0;

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

const PhotoBox = styled.label`
  width: 135px;
  height: 135px;

  border-radius: 20px;
  border: dashed 0.5px #e8ebf1;
  background: #f8f9fa;

  margin: 5px 0;

  display: grid;
  place-items: center;
  overflow: hidden;

  cursor: pointer;
`;

const Plus = styled.img``;

const PhotoInput = styled.input`
  display: none;
  width: 100%;
  height: 100%;
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

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
  gap: 3px;
`;

const TimeSelect = styled.select`
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  &:invalid {
    font-weight: 400;
    color: #a5a5a5;
  }

  &:disabled {
    color: #a5a5a5;
    font-weight: 400;
    cursor: not-allowed;
    opacity: 1; /* 브라우저 기본 흐려짐이 싫으면 유지 */
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

const TimeText = styled.div`
  font-size: 14px;
  color: #a5a5a5;

  margin: 5px 10px;
`;

const Option = styled.option``;

const DeleteButton = styled.button`
  border: none;
  background: transparent;

  padding: 0;

  cursor: pointer;
`;

const DeleteImg = styled.img``;

const StoreTagGrid = styled.div`
  margin-top: 6px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 8px;
  column-gap: 12px;
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
  margin: 10px 0 20px 0;

  display: flex;
  gap: 4px;
`;

const MenuPhotoBox = styled.label`
  width: 116px;
  height: 116px;

  border-radius: 20px;
  border: dashed 0.5px #e8ebf1;
  background: #f8f9fa;

  display: grid;
  place-items: center;
  overflow: hidden;

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

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  margin-top: 6px;
`;

const MenuCard = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr 30px;
  gap: 12px;
  align-items: center;

  background: #f8f9fa;
  border-radius: 20px;
  border: 1px solid #e8ebf1;

  padding: 14px;
`;

const MenuThumb = styled.div`
  width: 72px;
  height: 72px;

  background: var(--main-color4);
  border-radius: 20px;
  border: 1px solid #a5a5a5;

  overflow: hidden;
`;

const MenuThumbImg = styled.img`
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
`;

const MenuInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MenuNameRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const MenuName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111;
`;

const MenuPrice = styled.div`
  font-size: 16px;
  color: #a5a5a5;
`;

const Badge = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--main-color4);

  background: var(--main-color2);
  border-radius: 999px;

  padding: 3px 10px;
`;

const BadgeButton = styled.button`
  font-size: 12px;
  font-weight: 500;
  color: var(--main-color2);

  background: var(--main-color4);
  border-radius: 999px;
  border: 1px solid var(--main-color2);

  padding: 0 5px;

  cursor: pointer;
`;

const SubmitButton = styled.button`
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  color: var(--main-color4);

  width: calc(100% - 26px);

  border: none;
  border-radius: 20px;
  background: var(--main-color2);

  padding: 18px 0;
  margin: auto;
  margin-top: 99px;
  margin-bottom: 18px;

  cursor: pointer;
`;
