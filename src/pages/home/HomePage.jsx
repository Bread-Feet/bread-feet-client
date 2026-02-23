import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";

import PageLayout from "../../components/layout/PageLayout";
import BakeryCard from "../bakery/BakeryCard";
import useBakeries from "../bakery/hooks/useBakeries";
import useSearch from "../../hooks/useSearch";
import { fetchRandomBakeries } from "../../lib/api/bakery";
import { getValidAccessToken } from "../../lib/token-storage";
import { createBookmark, deleteBookmark } from "../../lib/api/bookmark";

const mascot = "/mascot.svg";
const userIcon = "/UserCircle.svg";
const heart_on = "/heart_on.svg";
const heart_off = "/heart_off.svg";

export default function HomePage() {
  const nav = useNavigate();
  const { query, debouncedQuery, setQuery } = useSearch();
  const { bakeries, isLoading, hasMore, loadMore } = useBakeries(debouncedQuery);
  const [bookmarks, setBookmarks] = useState({});
  const sentinelRef = useRef(null);

  const [randomBakeries, setRandomBakeries] = useState([]);
  const [randomLoading, setRandomLoading] = useState(true);

  useEffect(() => {
    fetchRandomBakeries(4)
      .then((data) => setRandomBakeries(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setRandomLoading(false));
  }, []);

  useEffect(() => {
    setBookmarks((prev) => {
      const next = { ...prev };
      bakeries.forEach((b) => {
        if (!(b.bakeryId in next)) next[b.bakeryId] = b.isBookmark ?? false;
      });
      randomBakeries.forEach((b) => {
        if (!(b.bakeryId in next)) next[b.bakeryId] = b.isBookmark ?? false;
      });
      return next;
    });
  }, [bakeries, randomBakeries]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) loadMore();
  }, [isLoading, hasMore, loadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) handleLoadMore(); },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  const handleToggleLike = useCallback(
    async (bakeryId) => {
      const token = await getValidAccessToken();
      if (!token) return;
      const current = bookmarks[bakeryId] ?? false;
      setBookmarks((prev) => ({ ...prev, [bakeryId]: !current }));
      try {
        if (!current) await createBookmark({ bakeryId });
        else await deleteBookmark({ bakeryId });
      } catch {
        setBookmarks((prev) => ({ ...prev, [bakeryId]: current }));
      }
    },
    [bookmarks],
  );

  const myRecs = randomBakeries.slice(0, 2);
  const todayRecs = randomBakeries.slice(2, 4);

  return (
    <PageLayout>
      <Scroll>
        <Header>
          <HeaderRow>
            <Title>BreadFeet</Title>
            <ProfileBtn aria-label="profile">
              <UserIcon src={userIcon} alt="유저 프로필" />
            </ProfileBtn>
          </HeaderRow>
        </Header>

        <SearchWrap>
          <HeaderMascot src={mascot} alt="" />

          <SearchBar>
            <SearchInput
              placeholder="빵집 이름을 검색해보세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </SearchBar>
        </SearchWrap>

        <Main>
          {!query && (
            <>
              <Section>
                <SectionTitle>나의 빵집 추천</SectionTitle>
                <Grid>
                  {randomLoading
                    ? Array.from({ length: 2 }).map((_, i) => <SkeletonItem key={i} />)
                    : myRecs.map((b) => (
                        <Item key={b.bakeryId} onClick={() => nav(`/bakery/${b.bakeryId}`)}>
                          <Card>
                            {b.imageUrl ? (
                              <CardImg src={b.imageUrl} alt={b.name} />
                            ) : (
                              <CardMascot src={mascot} alt="" />
                            )}
                            <HeartBtn
                              type="button"
                              aria-label={bookmarks[b.bakeryId] ? "즐겨찾기 해제" : "즐겨찾기"}
                              aria-pressed={bookmarks[b.bakeryId]}
                              onClick={(e) => { e.stopPropagation(); handleToggleLike(b.bakeryId); }}
                            >
                              <HeartIcon src={bookmarks[b.bakeryId] ? heart_on : heart_off} />
                            </HeartBtn>
                          </Card>
                          <NameText>{b.name}</NameText>
                          <MetaText>{b.address?.roadAddress}</MetaText>
                        </Item>
                      ))}
                </Grid>
              </Section>

              <Section>
                <SectionTitle>오늘의 빵지순례 추천</SectionTitle>
                <Grid>
                  {randomLoading
                    ? Array.from({ length: 2 }).map((_, i) => <SkeletonItem key={i} />)
                    : todayRecs.map((b) => (
                        <Item key={b.bakeryId} onClick={() => nav(`/bakery/${b.bakeryId}`)}>
                          <Card>
                            {b.imageUrl ? (
                              <CardImg src={b.imageUrl} alt={b.name} />
                            ) : (
                              <CardMascot src={mascot} alt="" />
                            )}
                            <HeartBtn
                              type="button"
                              aria-label={bookmarks[b.bakeryId] ? "즐겨찾기 해제" : "즐겨찾기"}
                              aria-pressed={bookmarks[b.bakeryId]}
                              onClick={(e) => { e.stopPropagation(); handleToggleLike(b.bakeryId); }}
                            >
                              <HeartIcon src={bookmarks[b.bakeryId] ? heart_on : heart_off} />
                            </HeartBtn>
                          </Card>
                          <NameText>{b.name}</NameText>
                          <MetaText>{b.address?.roadAddress}</MetaText>
                        </Item>
                      ))}
                </Grid>
              </Section>

              <Divider />

              <Section>
                <SectionTitle>최신 빵집</SectionTitle>
              </Section>
            </>
          )}

          {query && (
            <Section>
              <SectionTitle>검색 결과</SectionTitle>
            </Section>
          )}

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
        </Main>
      </Scroll>
    </PageLayout>
  );
}

const Scroll = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const Header = styled.header`
  width: 100%;
  flex-shrink: 0;
  background: var(--main-color2);
  padding: 65px 0 70px 0;
`;

const HeaderRow = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-family: "Fredoka";
  font-size: 48px;
  color: #ffdc8b;
  letter-spacing: 2px;
  margin: 0;
`;

const ProfileBtn = styled.button`
  position: absolute;
  right: 13px;
  top: 130%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  border: none;
  border-radius: 999px;
  background: transparent;
  padding: 0;
  cursor: pointer;
`;

const UserIcon = styled.img`
  width: 40px;
  height: 40px;
`;

const SearchWrap = styled.div`
  position: relative;
  flex-shrink: 0;
  background: white;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  padding: 15px 19px 0 19px;
`;

const HeaderMascot = styled.img`
  position: absolute;
  left: 50%;
  top: 0;
  width: 140px;
  transform: translate(-50%, -55%);
  pointer-events: none;
`;

const SearchBar = styled.div`
  width: 100%;
  height: 72px;
  background: #ffffff;
  border-radius: 999px;
  border: solid 5px var(--main-color2);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  padding: 0 18px;
`;

const SearchInput = styled.input`
  font-size: 16px;
  width: 100%;
  height: 62px;
  border: 0;
  outline: none;
  background: transparent;
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
  background: var(--main-color4);
  padding: 24px 24px 0 24px;
  padding-bottom: calc(var(--tabbar-height) + 20px);
`;

const Section = styled.section`
  width: 100%;
  margin-top: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #000000;
`;

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 0 9px;
`;

const Item = styled.div`
  min-width: 0;
  cursor: pointer;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  height: 148px;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
`;

const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardMascot = styled.img`
  width: 100%;
  height: auto;
`;

const HeartBtn = styled.button`
  position: absolute;
  right: 8px;
  top: 8px;
  display: grid;
  align-content: center;
  justify-content: center;
  background: transparent;
  border-radius: 999px;
  border: none;
  cursor: pointer;
`;

const HeartIcon = styled.img``;

const NameText = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #000000;
  margin-top: 16px;
  padding: 0 7px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MetaText = styled.div`
  font-size: 11px;
  color: #9e9e9e;
  padding: 0 7px;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Divider = styled.div`
  height: 1px;
  background: #e8ebf1;
  margin: 24px 0 0 0;
`;

const Sentinel = styled.div`
  height: 1px;
`;

/* ── 스켈레톤 ── */
const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    #ececec 25%,
    #f8f8f8 50%,
    #ececec 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s infinite linear;
  border-radius: 12px;
`;

const SkeletonCard = styled(SkeletonBase)`
  width: 100%;
  height: 148px;
  border-radius: 20px;
`;

const SkeletonLine = styled(SkeletonBase)`
  height: 12px;
  margin-top: 14px;
  width: ${(p) => p.$width ?? "70%"};
`;

function SkeletonItem() {
  return (
    <div>
      <SkeletonCard />
      <SkeletonLine $width="65%" />
      <SkeletonLine $width="45%" style={{ marginTop: 6 }} />
    </div>
  );
}
