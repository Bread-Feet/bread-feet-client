import styled, { css } from "styled-components";
import star from "/starIcon.svg";

export default function BakeryCard({ name, rating, reviewCount, address, onModifyClick, onDeleteClick }) {
  return (
    <Card>
      <Info>
        <Title>{name}</Title>
        <RatingRow>
          <StarIcon src={star} alt="" />
          <Rating>{Number(rating).toFixed(1)}</Rating>
          <Count>({reviewCount ?? 0})</Count>
        </RatingRow>
        <Address>{address}</Address>
      </Info>
      <Actions>
        <ActionButton $variant="outline" onClick={onModifyClick}>
          수정하기
        </ActionButton>
        <ActionButton $variant="danger" onClick={onDeleteClick}>
          삭제하기
        </ActionButton>
      </Actions>
    </Card>
  );
}

const Card = styled.div`
  font-family: "Pretendard";
  font-weight: 600;
  color: var(--main-color2);

  display: inline-flex;
  width: 100%;
  justify-content: space-between;
  border-bottom: solid #d5d5d5 1px;
  padding: 20px var(--page-padding);
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  width: min(215px, 100vw);
  margin: 4px 0;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 20px;
`;

const RatingRow = styled.div`
  display: flex;
  margin: 17px 0;
`;

const StarIcon = styled.img`
  width: 10px;
  height: auto;
  display: block;

  margin: 0 3px;
`;

const Rating = styled.div`
  font-size: 12px;
  color: black;

  margin: 0 2px;
`;

const Count = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: var(--gray-color);
`;

const Address = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: var(--gray-color);

  text-align: left;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const ActionButton = styled.button`
  font-size: 12px;
  font-weight: 500;

  border-radius: 999px;
  cursor: pointer;

  padding: 9px 25px;

  ${({ $variant }) =>
    $variant === "outline" &&
    css`
      background: #fff;
      color: var(--main-color2);

      border: none;
      box-shadow: inset 0 0 0 2px var(--main-color2);
    `}

  ${({ $variant }) =>
    $variant === "danger" &&
    css`
      background: var(--red-color);
      border: 0;
      color: #fff;
    `}
`;
