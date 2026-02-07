import styled from "styled-components";
import plus from "/plus.svg";

import {
  FormSection,
  SectionName,
  Field,
  Label,
  Input,
  PhotoBox,
  PhotoInput,
  PreviewImg,
  Plus,
} from "../styles";

import { openDaumPostcode } from "../../../../lib/daum-postcode";

export default function BakeryInfoSection({
  handleBakeryNameChange,
  address,
  setAddress,
  handleDetailedAddressChange,
  handlePhoneNumberChange,
  handleWebpageChange,
  mainPhotoPreview,
  handleMainPhotoChange,
}) {
  async function handleSearchAddress() {
    try {
      const data = await openDaumPostcode();
      setAddress(data.roadAddress || data.jibunAddress || "");
    } catch (err) {
      const msg = String(err?.message || "");
      if (msg.startsWith("Postcode closed:")) return;
      console.warn(err);
    }
  }

  return (
    <>
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
            <Input
              placeholder="주소를 검색하세요"
              type="text"
              value={address}
              readOnly
              disabled
              style={{ cursor: "not-allowed" }}
            />
            <SearchButton type="button" onClick={handleSearchAddress}>
              검색
            </SearchButton>
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
          <Label>대표 사진</Label>
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
    </>
  );
}

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

  margin: 0 0 5px 0;

  cursor: pointer;
`;
