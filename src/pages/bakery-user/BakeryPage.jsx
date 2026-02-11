import styled from "styled-components";

import PageLayout from "../../components/layout/PageLayout";
import SearchBar from "../bakery/SearchBar";
import BakeryCard from "./BakeryCard";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

const logoImg = "/menu_example_img.svg";

export default function BakeryPage() {
  const nav = useNavigate();
  const [sortKey, setSortKey] = useState("RECENT"); // "RECENT" | "KOREAN"
  const [bakeries, setBakeries] = useState([
    {
      id: 1,
      name: "성심당",
      rating: 4.9,
      reviewCount: 72,
      address: "대구광역시 북구 대학로 80 가나다라마바사아자차카파타하",
      imageUrl: logoImg,
      liked: true,
    },
    {
      id: 2,
      name: "앙앙빵집",
      rating: 5.0,
      reviewCount: 1689,
      address: "대전광역시 중구 대종로 480번길 15",
      imageUrl: logoImg,
      liked: false,
    },
  ]);

  const toggleLike = (id) => {
    setBakeries((prev) =>
      prev.map((b) => (b.id === id ? { ...b, liked: !b.liked } : b)),
    );
  };

  return (
    <PageLayout>
      <Header>
        <Title>나의 빵집</Title>
        <SearchBar />
      </Header>
      <ButtonWrapper>
        <SortButton
          type="button"
          aria-pressed={sortKey === "RECENT"}
          $active={sortKey === "RECENT"}
          onClick={() => setSortKey("RECENT")}
        >
          최근순
        </SortButton>
        <SortButton
          type="button"
          aria-pressed={sortKey === "KOREAN"}
          $active={sortKey === "KOREAN"}
          onClick={() => setSortKey("KOREAN")}
        >
          가나다순
        </SortButton>
      </ButtonWrapper>
      <Scroll>
        {bakeries.map((b) => (
          <BakeryCard
            key={b.id}
            name={b.name}
            rating={b.rating}
            reviewCount={b.reviewCount}
            address={b.address}
            imageUrl={b.imageUrl}
            liked={b.liked}
            onToggleLike={() => toggleLike(b.id)}
            onClick={() => nav(`/bakery/${b.id}`)}
          />
        ))}
      </Scroll>
    </PageLayout>
  );
}

const Header = styled.header`
  width: 100%;

  background: var(--main-color2);
  padding: 57px var(--page-padding) 10px var(--page-padding);
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;

  margin: 12px 0;
`;

const ButtonWrapper = styled.div`
  width: 100%;

  display: flex;
  gap: 12px;

  padding: 12px 20px;
`;

const SortButton = styled.button`
  font-size: 12px;
  font-weight: 500;
  color: ${(p) => (p.$active ? "var(--main-color4)" : "#a5a5a5")};

  width: 100px;

  border: ${(p) =>
    p.$active ? "solid 1px var(--main-color4)" : "solid 1px #a5a5a5"};
  border-radius: 20px;
  background: ${(p) => (p.$active ? "var(--main-color2)" : "transparent")};

  padding: 8px 0;
`;

const Scroll = styled.div`
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding-bottom: var(--tabbar-height);

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
