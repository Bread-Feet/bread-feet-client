import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function BakeryPreviewCard({ bakery, onClose }) {
  const nav = useNavigate();

  if (!bakery) return null;

  const address =
    bakery.address?.roadAddress ||
    bakery.roadAddress ||
    bakery.address?.lotNumber ||
    bakery.lotNumber ||
    bakery.address?.autoRoadAddress ||
    bakery.address?.lotAddress ||
    bakery.address?.autoLotAddress ||
    "";

  const handleCardClick = () => nav(`/bakery/${bakery.bakeryId}`);

  return (
    <Backdrop onClick={onClose}>
      <Card
        role="button"
        tabIndex={0}
        aria-label={`${bakery.name} 상세 보기`}
        onClick={(e) => {
          e.stopPropagation();
          handleCardClick();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
      >
        {bakery.imageUrl && (
          <Thumbnail src={bakery.imageUrl} alt={bakery.name} />
        )}
        <Info>
          <Name>{bakery.name}</Name>
          {address && <Address>{address}</Address>}
          <Meta>
            <Rating>★ {bakery.averageRating?.toFixed(1) ?? "-"}</Rating>
            <ReviewCount>리뷰 {bakery.reviewCount ?? 0}개</ReviewCount>
          </Meta>
        </Info>
        <Arrow>›</Arrow>
      </Card>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  z-index: 10;
`;

const Card = styled.div`
  position: absolute;
  bottom: 100px;
  left: 16px;
  right: 16px;

  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;

  cursor: pointer;

  &:active {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
`;

const Thumbnail = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
  background: #f0f0f0;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0 4px;
`;

const Address = styled.p`
  font-size: 12px;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0 6px;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Rating = styled.span`
  font-size: 13px;
  color: #f5a623;
  font-weight: 500;
`;

const ReviewCount = styled.span`
  font-size: 12px;
  color: #aaa;
`;

const Arrow = styled.span`
  font-size: 20px;
  color: #ccc;
  flex-shrink: 0;
`;
