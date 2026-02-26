import styled from "styled-components";

export default function BakerySelectCard({ name, address, onClick }) {
  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`${name} 선택`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <Info>
        <Name title={name}>{name}</Name>
        <Address title={address}>{address}</Address>
      </Info>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  align-items: center;

  border-bottom: solid 1px #d5d5d5;
  background: #ffffff;

  padding: 16px 24px;

  cursor: pointer;
`;

const Info = styled.div`
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Name = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #080808;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Address = styled.div`
  font-size: 12.5px;
  color: #8b8f95;
  line-height: 1.35;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
