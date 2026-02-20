import styled from "styled-components";

import PageLayout from "../../components/layout/PageLayout";
import SearchBar from "../../components/SearchBar";
import BakeryCard from "./BakeryCard";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useSearch from "../../hooks/useSearch";
import useBakeries from "./hooks/useBakeries";

const plus = "/xIcon.svg";

export default function BakeryPage() {
  const nav = useNavigate();
  const [sortKey, setSortKey] = useState("RECENT"); // "RECENT" | "KOREAN"
  const { query, debouncedQuery, setQuery, clearQuery } = useSearch();
  const { bakeries } = useBakeries(debouncedQuery);

  return (
    <PageLayout>
      <Header>
        <Title>나의 빵집</Title>
        <SearchBar value={query} onChange={setQuery} onClear={clearQuery} />
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
            key={b.bakeryId}
            name={b.name}
            rating={b.averageRating}
            reviewCount={b.reviewCount}
            address={[b.address?.roadAddress, b.address?.detail]
              .filter(Boolean)
              .join(" ")}
            imageUrl={b.imageUrl}
            liked={false}
            onToggleLike={() => {}}
            onClick={() => nav(`/bakery/${b.bakeryId}`)}
          />
        ))}
      </Scroll>
      <MyBakeryFab
        type="button"
        onClick={() => nav("/mybakery")}
        aria-label="내 빵집으로 이동"
      >
        <FabIcon src={plus} alt="" />
      </MyBakeryFab>
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

  padding-bottom: calc(var(--tabbar-height) + 60px);

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

const MyBakeryFab = styled.button`
  position: fixed;
  bottom: calc(var(--tabbar-height) + 8px);
  left: 50%;
  transform: translateX(-50%);

  width: 40px;
  height: 40px;

  border: none;
  border-radius: 999px;
  background: var(--main-color2);

  display: grid;
  align-content: center;
  justify-content: center;

  cursor: pointer;
  z-index: 20;
`;

const FabIcon = styled.img`
  width: 50px;
  height: 50px;

  transform: rotate(45deg);
`;
