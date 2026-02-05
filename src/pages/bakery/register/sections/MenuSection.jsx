import styled from "styled-components";
import plus from "/plus.svg";
import plus_brown from "/plus_brown.svg";
import deleteIcon from "/deleteIcon.svg";

import {
  FormSection,
  SectionName,
  Label,
  PhotoInput,
  PreviewImg,
  Plus,
  DeleteButton,
  DeleteImg,
  InlineAction,
} from "../styles";

export default function MenuSection({
  menus,
  newMenu,
  setNewMenu,
  draftMenuPhotoPreview,
  handleDraftMenuPhotoChange,
  addMenu,
  removeMenu,
  setMainMenu,
}) {
  return (
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
  );
}

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
