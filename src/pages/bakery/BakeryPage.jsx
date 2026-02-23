import styled from "styled-components";

import PageLayout from "../../components/layout/PageLayout";
import SearchBar from "../../components/SearchBar";
import BakeryCard from "./BakeryCard";
import MoveBakeryPage from "../../components/MoveBakeryPage";

import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import useSearch from "../../hooks/useSearch";
import useBakeries from "./hooks/useBakeries";
import { getValidAccessToken } from "../../lib/token-storage";
import { createBookmark, deleteBookmark } from "../../lib/api/bookmark";

export default function BakeryPage() {
  const nav = useNavigate();
  // TODO : add sort param to api
  const [sortKey, setSortKey] = useState("RECENT"); // "RECENT" | "KOREAN"
  const { query, debouncedQuery, setQuery, clearQuery } = useSearch();
  const { bakeries, isLoading, hasMore, loadMore } =
    useBakeries(debouncedQuery);
  const sentinelRef = useRef(null);
  const [bookmarks, setBookmarks] = useState({});

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) loadMore();
  }, [isLoading, hasMore, loadMore]);

  useEffect(() => {
    setBookmarks((prev) => {
      const next = { ...prev };
      bakeries.forEach((b) => {
        if (!(b.bakeryId in next)) {
          next[b.bakeryId] = b.isBookmark ?? false;
        }
      });
      return next;
    });
  }, [bakeries]);

  const handleToggleLike = useCallback(
    async (bakeryId) => {
      const token = await getValidAccessToken();
      if (!token) {
        const returnUrl = window.location.pathname + window.location.search;
        nav(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
        return;
      }
      const current = bookmarks[bakeryId] ?? false;
      setBookmarks((prev) => ({ ...prev, [bakeryId]: !current }));
      try {
        if (!current) {
          await createBookmark({ bakeryId });
        } else {
          await deleteBookmark({ bakeryId });
        }
      } catch {
        setBookmarks((prev) => ({ ...prev, [bakeryId]: current }));
      }
    },
    [bookmarks, nav],
  );

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

  return (
    <PageLayout>
      <Header>
        <MoveBakeryPage />
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
            liked={bookmarks[b.bakeryId] ?? false}
            onToggleLike={() => handleToggleLike(b.bakeryId)}
            onClick={() => nav(`/bakery/${b.bakeryId}`)}
          />
        ))}
        <Sentinel ref={sentinelRef} />
      </Scroll>
    </PageLayout>
  );
}

const Header = styled.header`
  width: 100%;

  background: var(--main-color2);
  padding: 57px var(--page-padding) 10px var(--page-padding);
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
