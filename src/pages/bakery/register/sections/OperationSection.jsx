import styled from "styled-components";
import plus_brown from "/plus_brown.svg";
import deleteIcon from "/deleteIcon.svg";

import {
  FormSection,
  SectionName,
  Label,
  Plus,
  DeleteButton,
  DeleteImg,
  InlineAction,
} from "../styles";

export default function OperationSection({
  hours,
  addHourRow,
  updateHour,
  removeHourRow,
  TIME_OPTIONS,
  toMinutes,
  storeTags,
  setTag,
}) {
  return (
    <>
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
                <DeleteButton type="button" onClick={() => removeHourRow(h.id)}>
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
    </>
  );
}

const TimeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 8px;
  margin: 20px 0 0 0;
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

  padding: 0 20px;

  cursor: pointer;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  background-image: url("/dropboxIcon.svg");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px 16px;
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
  background-position: right 10px center;
  background-size: 16px 16px;
`;

const TimeText = styled.div`
  font-size: 14px;
  color: #a5a5a5;

  margin: 5px 10px;
`;

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
