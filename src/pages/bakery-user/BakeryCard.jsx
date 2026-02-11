import styled from "styled-components";

const star = "/starIcon.svg";
const heart_off = "/heart_off.svg";
const heart_on = "/heart_on.svg";

export default function BakeryCard({
  name,
  rating,
  reviewCount,
  address,
  imageUrl,
  liked = false,
  onToggleLike,
  onClick,
}) {
  const handleToggleLike = (e) => {
    e.stopPropagation();
    onToggleLike?.(!liked);
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`${name} 상세 보기`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <ThumbWrap>
        {imageUrl ? (
          <Thumb src={imageUrl} alt={`${name} 사진`} />
        ) : (
          <ThumbFallback aria-hidden />
        )}

        <LikeButton
          type="button"
          aria-label={liked ? "즐겨찾기 해제" : "즐겨찾기"}
          aria-pressed={liked}
          onClick={handleToggleLike}
        >
          <HeartIcon src={liked ? heart_on : heart_off} />
        </LikeButton>
      </ThumbWrap>

      <Info>
        <Name title={name}>{name}</Name>

        <MetaRow>
          <StarIcon src={star} alt="" aria-hidden="true" />
          <RatingText>{Number(rating).toFixed(1)}</RatingText>
          <ReviewCount>({reviewCount ?? 0})</ReviewCount>
        </MetaRow>

        <Address title={address}>{address}</Address>
      </Info>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  border-bottom: solid 1px #d5d5d5;
  background: #ffffff;

  padding: 14px 24px;

  cursor: pointer;
`;

const ThumbWrap = styled.div`
  width: 120px;
  height: 120px;

  flex: 0 0 120px;

  position: relative;
`;

const ThumbBase = styled.div`
  width: 120px;
  height: 120px;

  border-radius: 20px;

  overflow: hidden;
`;

const Thumb = styled.img`
  width: 120px;
  height: 120px;

  display: block;
  border-radius: 20px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

  object-fit: cover;
`;

const ThumbFallback = styled(ThumbBase)`
  background: #f1f3f5;
`;

const LikeButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;

  width: 52px;
  height: 52px;

  display: grid;
  place-items: center;

  border-radius: 999px;
  border: none;
  background: transparent;

  padding: 8px;

  cursor: pointer;
`;

const HeartIcon = styled.img`
  width: 100%;
  height: 100%;
`;

const Info = styled.div`
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;

  margin: 10px 0;
`;

const Name = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #080808;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const StarIcon = styled.img`
  width: 13px;
  height: 13px;
`;

const RatingText = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #000000;
`;

const ReviewCount = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #9e9e9e;
`;

const Address = styled.div`
  font-size: 12.5px;
  color: #b0b5bb;
  line-height: 1.35;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
