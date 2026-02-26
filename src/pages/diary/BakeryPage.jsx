import styled from "styled-components";

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";

import PageLayout from "../../components/layout/PageLayout";
import SearchBar from "../../components/SearchBar";
import useSearch from "../../hooks/useSearch";
import useBakeries from "../bakery/hooks/useBakeries";
import { useDiaryEditorStore } from "../../store/diaryEditorStore";
import BakerySelectCard from "./BakerySelectCard";
import BackMark from "../../assets/BackMark.svg";

export default function DiaryBakeryPage() {
  const nav = useNavigate();
  const { search } = useLocation();
  const [sortKey, setSortKey] = useState(""); // "" for RECENT, "NAME" for KOREAN
  const { query, debouncedQuery, setQuery, clearQuery } = useSearch();
  const { bakeries, isLoading, hasMore, loadMore } = useBakeries(
    debouncedQuery,
    sortKey,
    false,
  );
  const sentinelRef = useRef(null);
  const setBakery = useDiaryEditorStore((s) => s.setBakery);
  const storeDate = useDiaryEditorStore((s) => s.date);

  const dateParam = useMemo(() => {
    const params = new URLSearchParams(search);
    return params.get("date");
  }, [search]);

  const resolvedDate = dateParam || storeDate;

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) loadMore();
  }, [isLoading, hasMore, loadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) handleLoadMore();
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  const handleSelectBakery = (bakery) => {
    if (!bakery) return;
    setBakery({
      bakeryId: bakery.bakeryId,
      name: bakery.name,
      address: bakery.address,
    });

    if (resolvedDate) {
      nav(`/diary/new?date=${encodeURIComponent(resolvedDate)}`);
    } else {
      nav(-1);
    }
  };

  return (
    <PageLayout
      frameStyle={`align-items: stretch; background: #FFFCF5; overflow: hidden;`}
    >
      <Header>
        <TopRow>
          <BackButton type="button" onClick={() => nav(-1)} aria-label="back">
            <BackIcon src={BackMark} alt="뒤로가기" />
          </BackButton>
          <Title>베이커리 선택</Title>
          <RightSpacer />
        </TopRow>
        <SearchBar value={query} onChange={setQuery} onClear={clearQuery} />
      </Header>
      <ButtonWrapper>
        <SortButton
          type="button"
          aria-pressed={sortKey === ""}
          $active={sortKey === ""}
          onClick={() => setSortKey("")}
        >
          최근순
        </SortButton>
        <SortButton
          type="button"
          aria-pressed={sortKey === "NAME"}
          $active={sortKey === "NAME"}
          onClick={() => setSortKey("NAME")}
        >
          가나다순
        </SortButton>
      </ButtonWrapper>
      <Scroll>
        {bakeries.map((b) => (
          <BakerySelectCard
            key={b.bakeryId}
            name={b.name}
            address={[b.address?.roadAddress, b.address?.detail]
              .filter(Boolean)
              .join(" ")}
            onClick={() => handleSelectBakery(b)}
          />
        ))}
        <Sentinel ref={sentinelRef} />
      </Scroll>
    </PageLayout>
  );
}

const Header = styled.header`
  width: 100%;

  background: #f8edd0;
  background: linear-gradient(
    rgba(248, 237, 208, 1) 0%,
    rgba(255, 255, 255, 1) 100%
  );

  padding: 28px var(--page-padding) 10px var(--page-padding);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TopRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
`;

const BackButton = styled.button`
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
`;

const BackIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin: 0;
`;

const RightSpacer = styled.div`
  width: 40px;
  height: 40px;
`;

const Sentinel = styled.div`
  height: 1px;
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

  padding-bottom: 40px;

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
