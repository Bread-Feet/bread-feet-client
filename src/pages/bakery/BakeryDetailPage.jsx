import styled from "styled-components";
const arrow_left = "/arrow_left_white.svg";
const heart_off = "/heart_off.svg";
const heart_on = "/heart_on.svg";
const star = "/starIcon.svg";
const location = "/location.svg";
const tell = "/tell.svg";
const link = "/link.svg";
const clock = "/clock.svg";
const dropboxIcon = "/dropboxIcon.svg";

import PageLayout from "../../components/layout/PageLayout";

import { useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useReviews from "./hooks/useReviews";
import useBookmark from "./hooks/useBookmark";

function toKoreanDay(jsDay) {
  switch (jsDay) {
    case 0:
      return "일";
    case 1:
      return "월";
    case 2:
      return "화";
    case 3:
      return "수";
    case 4:
      return "목";
    case 5:
      return "금";
    case 6:
      return "토";
    default:
      return "";
  }
}

const dayToLabel = (d) => (d ? `${d}요일` : "");

function getOpenStatus(businessHours, now = new Date()) {
  if (!Array.isArray(businessHours) || businessHours.length === 0) {
    return { state: "unknown" };
  }

  const dayKeyToday = toKoreanDay(now.getDay());
  const today = businessHours?.find((x) => x?.day === dayKeyToday);

  if (!today) return { state: "unknown" };

  const rawTime = String(today.time ?? "").trim();
  if (!rawTime) return { state: "unknown" };

  if (rawTime.replace(/\s/g, "") === "00:00-00:00") {
    return { state: "closed" };
  }

  const parsed = parseRangeNoMidnight(rawTime);
  if (!parsed) return { state: "unknown" };

  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const { startMin, endMin } = parsed;

  const isOpen = minutesNow >= startMin && minutesNow < endMin;
  return { state: isOpen ? "open" : "closed" };
}

function parseRangeNoMidnight(timeStr) {
  if (!timeStr) return null;
  const raw = String(timeStr).trim();
  if (!raw) return null;

  if (raw.replace(/\s/g, "") === "00:00-00:00") return null;

  const parts = raw.split("-").map((s) => s.trim());

  if (parts.length !== 2) return null;

  const startMin = parseHHMM(parts[0]);
  const endMin = parseHHMM(parts[1]);
  if (startMin == null || endMin == null) return null;

  if (endMin <= startMin) return null;

  return { startMin, endMin };
}

function parseHHMM(s) {
  const m = String(s).match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;

  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;

  if (hh === 24 && mm === 0) return 24 * 60;

  if (hh < 0 || hh > 23) return null;
  if (mm < 0 || mm > 59) return null;

  return hh * 60 + mm;
}

const exampleImg = "/examplePhoto.jpg";
export default function BakeryDetailPage() {
  const nav = useNavigate();
  const { id } = useParams();

  const [tab, setTab] = useState("home");

  const bakery = useMemo(() => {
    return {
      id,
      name: "맛있는 빵집",
      rating: 5.0,
      reviewCount: 1689,
      address: {
        detail: "101호",
        lotNumber: "1-45",
        roadAddress: "서울특별시 강남구 테헤란로 123",
      },
      imageUrl: exampleImg,
      phoneNumber: "010-1234-5678",
      websiteUrl: "https://www.instagram.com/",
      businessHours: [
        { day: "월", time: "09:00 - 18:00" },
        { day: "화", time: "09:00 - 18:00" },
        { day: "수", time: "09:00 - 18:00" },
        { day: "목", time: "09:00 - 10:00" },
        { day: "금", time: "09:00 - 18:00" },
        { day: "토", time: "00:00 - 00:00" },
        { day: "일", time: "" },
      ],
      bestBread: "소금빵",
      features: {
        beverage: true,
        dineIn: true,
        waiting: "onsite", // "onsite" | "online" | "none"
        parking: true,
      },
      menus: [
        {
          name: "소금빵",
          price: 3000,
          thumbnailUrl: exampleImg,
        },
        {
          name: "바게트",
          price: 4500,
          thumbnailUrl: exampleImg,
        },
      ],
    };
  }, [id]);

  const { reviews: rawReviews, isLoading: reviewsLoading, hasMore: reviewsHasMore, loadMore: loadMoreReviews } = useReviews(tab === "review" ? id : null);
  const { isBookmarked, toggle: toggleBookmark } = useBookmark(id);

  const reviews = useMemo(
    () =>
      rawReviews.map((r) => ({
        id: r.reviewId,
        authorName: r.nickname,
        createdAt: r.createdAt,
        rating: r.rating,
        content: r.content,
        photos: r.thumbnailUrl ? [r.thumbnailUrl] : [],
        likeCount: r.likeCount,
        isLiked: r.isLiked,
        isMyReview: r.isMyReview,
      })),
    [rawReviews],
  );

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const status = useMemo(
    () => getOpenStatus(bakery.businessHours, now),
    [bakery.businessHours, now],
  );

  return (
    <PageLayout>
      <Scroll>
        <Hero>
          <HeroImg src={bakery.imageUrl} alt={bakery.name} />
          <HeroDim />

          <HeroTop>
            <CircleBtn
              type="button"
              aria-label="뒤로가기"
              onClick={() => nav(-1)}
            >
              <ArrowLeftIcon src={arrow_left} alt="" aria-hidden="true" />
            </CircleBtn>
            <CircleBtn
              type="button"
              aria-label={isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
              aria-pressed={isBookmarked}
              onClick={toggleBookmark}
            >
              <HeartIcon src={isBookmarked ? heart_on : heart_off} alt="" aria-hidden="true" />
            </CircleBtn>
          </HeroTop>
        </Hero>

        <Card>
          <TitleRow>
            <BakeryNameWrapper>
              <BakeryName>{bakery.name}</BakeryName>
            </BakeryNameWrapper>
            <RatingBox>
              <StarIcon src={star} />
              <RatingText>
                {bakery.rating.toFixed(1)}{" "}
                <RatingCount>
                  ({bakery.reviewCount.toLocaleString()})
                </RatingCount>
              </RatingText>
            </RatingBox>
          </TitleRow>

          <Tabs>
            <TabButtons>
              <TabBtn
                type="button"
                $active={tab === "home"}
                onClick={() => setTab("home")}
              >
                홈
              </TabBtn>
              <TabBtn
                type="button"
                $active={tab === "menu"}
                onClick={() => setTab("menu")}
              >
                메뉴
              </TabBtn>
              <TabBtn
                type="button"
                $active={tab === "review"}
                onClick={() => setTab("review")}
              >
                리뷰
              </TabBtn>
            </TabButtons>

            <IndicatorRow aria-hidden="true">
              <IndicatorBar $active={tab === "home"} />
              <IndicatorBar $active={tab === "menu"} />
              <IndicatorBar $active={tab === "review"} />
            </IndicatorRow>
          </Tabs>

          {tab === "home" ? (
            <HomeSection bakery={bakery} status={status} />
          ) : tab === "menu" ? (
            <MenuSection menus={bakery.menus} bestBread={bakery.bestBread} />
          ) : (
            <ReviewSection
              reviews={reviews}
              isLoading={reviewsLoading}
              hasMore={reviewsHasMore}
              onLoadMore={loadMoreReviews}
              onCreate={() => nav(`/bakery/${bakery.id}/addreview`)}
            />
          )}
        </Card>
      </Scroll>
    </PageLayout>
  );
}

// home section
function HomeSection({ bakery, status }) {
  const [hoursOpen, setHoursOpen] = useState(false);
  const hoursPanelId = `hours-panel-${bakery.id}`;
  const canShowHours = status.state !== "unknown";

  const hoursOpenUI = canShowHours && hoursOpen;

  const statusText =
    status.state === "open"
      ? "영업중"
      : status.state === "closed"
        ? "영업종료"
        : "영업정보없음";

  const active = {
    beverage: bakery.features.beverage,
    dineIn: bakery.features.dineIn,
    onsiteWaiting: bakery.features.waiting === "onsite",
    onlineWaiting: bakery.features.waiting === "online",
    parking: bakery.features.parking,
  };

  return (
    <HomeWrap>
      <InfoList>
        <InfoRow>
          <InfoIconWrap>
            <PinIcon src={location} />
          </InfoIconWrap>
          <InfoText>{bakery.address.roadAddress}</InfoText>
        </InfoRow>

        <InfoRow>
          <InfoIconWrap>
            <PhoneIcon src={tell} />
          </InfoIconWrap>
          <InfoText>{bakery.phoneNumber}</InfoText>
        </InfoRow>

        <InfoRow>
          <InfoIconWrap>
            <LinkIcon src={link} />
          </InfoIconWrap>
          <InfoLink href={bakery.websiteUrl} target="_blank" rel="noreferrer">
            {bakery.websiteUrl}
          </InfoLink>
        </InfoRow>

        <InfoRowButton
          type="button"
          onClick={() => {
            if (!canShowHours) return;
            setHoursOpen((v) => !v);
          }}
          aria-expanded={hoursOpenUI}
          aria-controls={hoursPanelId}
          aria-label="영업시간 펼치기"
          disabled={!canShowHours}
        >
          <InfoIconWrap>
            <ClockIcon src={clock} />
          </InfoIconWrap>
          <OpenStatus $state={status.state}>{statusText}</OpenStatus>
          {canShowHours && (
            <ChevronIcon src={dropboxIcon} $open={hoursOpenUI} />
          )}
        </InfoRowButton>
        {hoursOpenUI && (
          <HoursDropdown id={hoursPanelId}>
            <HoursList>
              {bakery.businessHours?.map((h) => (
                <HoursItem key={h.day}>
                  <HoursDay>{dayToLabel(h.day)}</HoursDay>
                  <HoursTime>{h.time || "-"}</HoursTime>
                </HoursItem>
              ))}
            </HoursList>
          </HoursDropdown>
        )}
      </InfoList>

      <Section>
        <SectionTitleRow>
          <SectionTitle>매장 정보</SectionTitle>
        </SectionTitleRow>

        <TagGrid>
          <Tag $active={active.beverage}># 음료 판매</Tag>
          <Tag $active={!active.beverage}># 음료 미판매</Tag>

          <Tag $active={active.dineIn}># 매장 섭식 가능</Tag>
          <Tag $active={!active.dineIn}># 매장 섭식 불가능</Tag>

          <Tag $active={active.onsiteWaiting}># 현장 웨이팅</Tag>
          <Tag $active={active.onlineWaiting}># 온라인 웨이팅</Tag>

          <Tag $active={active.parking}># 전용 주차장 보유</Tag>
          <Tag $active={!active.parking}># 전용 주차장 미보유</Tag>
        </TagGrid>
      </Section>
    </HomeWrap>
  );
}

// menu section
function MenuSection({ menus, bestBread }) {
  return (
    <MenuWrap>
      <MenuList>
        {menus?.map((m, idx) => {
          const isSignature =
            (m.name ?? "").trim() === (bestBread ?? "").trim();

          return (
            <MenuCard key={`${m.name}-${idx}`}>
              <MenuLeft>
                <MenuThumb>
                  {m.thumbnailUrl ? (
                    <MenuThumbImg src={m.thumbnailUrl} alt="" />
                  ) : (
                    <MenuThumbFallback aria-hidden="true">🥐</MenuThumbFallback>
                  )}
                </MenuThumb>

                <MenuInfo>
                  <MenuName>{m.name}</MenuName>
                  <MenuPrice>
                    {Number(m.price || 0).toLocaleString()}원
                  </MenuPrice>
                </MenuInfo>
              </MenuLeft>

              {isSignature && <MenuBadge>대표</MenuBadge>}
            </MenuCard>
          );
        })}
      </MenuList>
    </MenuWrap>
  );
}

// review section
function ReviewSection({ reviews, isLoading, hasMore, onLoadMore, onCreate }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <ReviewWrap aria-label="리뷰">
      <ReviewCtaBtn type="button" onClick={onCreate} aria-label="리뷰 등록하기">
        리뷰 등록하기
      </ReviewCtaBtn>

      <ReviewList role="list">
        {reviews?.map((r) => (
          <ReviewItem key={r.id} role="listitem">
            <ReviewHeader>
              <ReviewerAvatar>
                <ReviewerAvatarImg src={exampleImg} alt="" />
              </ReviewerAvatar>

              <HeaderMeta>
                <MetaTopRow>
                  <ReviewerName>{r.authorName}</ReviewerName>
                  <ReviewDate>{formatDotDate(r.createdAt)}</ReviewDate>
                </MetaTopRow>

                <StarRow aria-label={`별점 ${r.rating}점`}>
                  <StarRating rating={r.rating} />
                </StarRow>
              </HeaderMeta>
            </ReviewHeader>

            <ReviewBody>
              <ExpandableReviewText text={r.content} clampLines={3} />

              {!!r.photos?.length && <ReviewPhotos photos={r.photos} />}
            </ReviewBody>
          </ReviewItem>
        ))}
      </ReviewList>

      <div ref={sentinelRef} style={{ height: 1 }} />
    </ReviewWrap>
  );
}

function StarRating({ rating }) {
  const filled = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarSmall
          key={i}
          src={star}
          alt=""
          aria-hidden="true"
          $dim={i >= filled}
        />
      ))}
    </>
  );
}

function formatDotDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`;
}

function ExpandableReviewText({ text, clampLines = 3 }) {
  const [expanded, setExpanded] = useState(false);
  const [canToggle, setCanToggle] = useState(false);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const compute = () => {
      const style = getComputedStyle(el);

      const fontSize = parseFloat(style.fontSize) || 12;
      const lineHeightRaw = style.lineHeight;
      const lineHeight =
        lineHeightRaw === "normal" || Number.isNaN(parseFloat(lineHeightRaw))
          ? fontSize * 1.45
          : parseFloat(lineHeightRaw);

      const collapsedHeight = lineHeight * clampLines;

      setCanToggle(el.scrollHeight > collapsedHeight + 1);
    };

    compute();

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(compute);
      ro.observe(el);
    } else {
      window.addEventListener("resize", compute);
    }

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [text, clampLines]);

  return (
    <ReviewTextWrap>
      <ReviewText
        ref={textRef}
        $expanded={expanded}
        $clampLines={clampLines}
        $canToggle={canToggle}
      >
        {text}
      </ReviewText>

      {canToggle && (
        <ReviewToggleRow>
          <ReviewToggleBtn
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? "접기" : "더보기"}
          </ReviewToggleBtn>
        </ReviewToggleRow>
      )}
    </ReviewTextWrap>
  );
}

function ReviewPhotos({ photos }) {
  const trackRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;

    // 오차 방지용 epsilon
    const EPS = 2;

    setCanLeft(el.scrollLeft > EPS);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - EPS);
  };

  const getStep = () => {
    const el = trackRef.current;
    if (!el) return 240;

    const first = el.firstElementChild;
    const slideW = first ? first.getBoundingClientRect().width : 120;

    const style = getComputedStyle(el);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 0;

    return slideW + gap;
  };

  const scrollByDir = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * getStep(), behavior: "smooth" });
  };

  useLayoutEffect(() => {
    updateArrows();

    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateArrows);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateArrows);
    };
  }, [photos?.length]);

  if (!photos?.length) return null;

  if (photos.length <= 2) {
    return (
      <ReviewPhotoGrid aria-label="리뷰 사진">
        {photos.map((url, idx) => (
          <ReviewPhotoItem key={`${idx}-${url}`}>
            <ReviewPhotoImg src={url} alt={`리뷰 사진 ${idx + 1}`} />
          </ReviewPhotoItem>
        ))}
      </ReviewPhotoGrid>
    );
  }

  return (
    <PhotoCarousel aria-label="리뷰 사진">
      <PhotoTrack
        ref={trackRef}
        tabIndex={0}
        aria-label="좌우로 스크롤하여 사진 보기"
      >
        {photos.map((url, idx) => (
          <PhotoSlide key={`${idx}-${url}`}>
            <PhotoSlideImg src={url} alt={`리뷰 사진 ${idx + 1}`} />
          </PhotoSlide>
        ))}
      </PhotoTrack>

      <CarouselArrowBtn
        type="button"
        $pos="left"
        onClick={() => scrollByDir(-1)}
        disabled={!canLeft}
        aria-label="이전 사진"
      >
        <CarouselArrowIcon src={arrow_left} alt="" aria-hidden="true" />
      </CarouselArrowBtn>

      <CarouselArrowBtn
        type="button"
        $pos="right"
        onClick={() => scrollByDir(1)}
        disabled={!canRight}
        aria-label="다음 사진"
      >
        <CarouselArrowIcon src={arrow_left} alt="" aria-hidden="true" $flip />
      </CarouselArrowBtn>
    </PhotoCarousel>
  );
}

const Hero = styled.div`
  position: sticky;
  top: 0;
  z-index: 0;

  height: 46vh;
  min-height: 340px;
  max-height: 520px;
  overflow: hidden;
`;

const HeroImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroDim = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.25),
    rgba(0, 0, 0, 0.05),
    rgba(0, 0, 0, 0)
  );
`;

const HeroTop = styled.div`
  width: 100%;

  position: absolute;
  top: 60px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 24px;
`;

const CircleBtn = styled.button`
  width: 44px;
  height: 44px;

  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(123, 123, 123, 0.2);
  backdrop-filter: blur(5px);

  display: grid;
  place-items: center;

  padding: 0;

  cursor: pointer;
`;

const ArrowLeftIcon = styled.img``;

const HeartIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const Scroll = styled.div`
  width: 100%;
  flex: 1;
  position: relative;
  overflow-y: auto;

  border-top-left-radius: 20px;
  border-top-right-radius: 20px;

  padding-bottom: var(--tabbar-height);
  margin-top: -18px;

  &::-webkit-scrollbar {
    width: 0;
  }

  &::-webkit-scrollbar-track {
    background: var(--main-color4);
  }

  &::-webkit-scrollbar-thumb {
    background: #000000;
    border-radius: 999px;
  }
`;

const Card = styled.div`
  width: 100%;
  position: relative;
  background: #fff;

  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -8px 18px rgba(0, 0, 0, 0.05);

  padding: 25px 0;
  margin-top: -18px;
`;

const TitleRow = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: end;

  margin: 0 25px;
`;

const BakeryNameWrapper = styled.span`
  margin: auto;
`;

const BakeryName = styled.h1`
  font-size: 40px;
  font-weight: 600;
  color: #000000;

  margin: 0;
`;

const RatingBox = styled.div`
  font-size: 12px;

  display: flex;
  align-items: center;
  gap: 4px;
`;

const StarIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const RatingText = styled.div`
  font-weight: 600;
  color: #000000;
`;

const RatingCount = styled.span`
  font-weight: 500;
  color: #9e9e9e;
`;

const Tabs = styled.div`
  border-bottom: 1px solid #d5d5d5;

  margin-top: 10px;
`;

const TabButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  padding: 0;
`;

const TabBtn = styled.button`
  font-size: 12px;
  font-weight: 500;
  color: ${(p) => (p.$active ? "var(--main-color2)" : "#9e9e9e")};

  background: transparent;
  border: 0;

  padding: 10px 0 0 0;

  cursor: pointer;
`;

const IndicatorRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

const IndicatorBar = styled.div`
  width: min(100px, 100%);
  height: 8px;

  border-radius: 999px;

  margin: 0 auto;

  background: ${(p) => (p.$active ? "var(--main-color2)" : "#d9d9d9")};
`;

// home

const HomeWrap = styled.div``;

const InfoList = styled.div`
  overflow: hidden;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  background: transparent;
  border-bottom: 1px solid #d5d5d5;

  padding: 7px 12px;
`;

const InfoIconWrap = styled.div`
  width: 26px;
  height: 26px;

  display: grid;
  place-items: center;
`;

const PinIcon = styled.img``;

const PhoneIcon = styled.img``;

const LinkIcon = styled.img``;

const ClockIcon = styled.img``;

const InfoText = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #000000;
`;

const InfoLink = styled.a`
  font-size: 14px;
  font-weight: 400;
  color: #000000;

  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:active {
    opacity: 0.85;
  }
`;

const InfoRowButton = styled.button`
  width: 100%;
  display: flex;
  gap: 10px;
  align-items: center;

  background: transparent;
  border: 0;
  border-bottom: 1px solid #d5d5d5;

  padding: 7px 12px;
  text-align: left;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`;

const OpenStatus = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${(p) =>
    p.$state === "open"
      ? "#000000"
      : p.$state === "closed"
        ? "var(--red-color)"
        : "#9e9e9e"};
`;

const ChevronIcon = styled.img`
  width: 14px;
  height: 14px;

  transform: rotate(${(p) => (p.$open ? "180deg" : "0deg")});
`;

const HoursDropdown = styled.div`
  height: 123px;

  display: flex;
  justify-content: center;
  background: transparent;
  border-bottom: 1px solid #d5d5d5;

  padding: 12px 0;
`;

const HoursList = styled.div`
  font-weight: 300;

  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  row-gap: 3px;
  column-gap: 45px;
`;

const HoursItem = styled.div`
  display: flex;
  gap: 10px;
  font-size: 12px;
  line-height: 1.4;
  color: #000;
`;

const HoursDay = styled.div``;

const HoursTime = styled.div``;

const Section = styled.section`
  display: flex;
  gap: 13px;
  align-items: flex-start;

  margin-top: 16px;
  padding: 0 20px;
`;

const SectionTitleRow = styled.div`
  display: flex;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #000000;

  margin: 0;
`;

const TagGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  column-gap: 24px;
  row-gap: 10px;

  justify-items: center;
`;

const Tag = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${(p) => (p.$active ? "var(--main-color2)" : "#d9d9d9")};

  padding: 0 13px;
`;

// menu

const MenuWrap = styled.div`
  padding: 16px;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MenuCard = styled.div`
  position: relative;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  background: #f8f9fa;
  border: 1px solid #e8ebf1;
  border-radius: 18px;

  padding: 14px 24px 14px 14px;
`;

const MenuLeft = styled.div`
  min-width: 0;

  display: flex;
  align-items: center;
  gap: 36px;
`;

const MenuThumb = styled.div`
  width: 72px;
  height: 72px;

  display: grid;
  place-items: center;
  flex: 0 0 auto;
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 20px;

  overflow: hidden;
`;

const MenuThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MenuThumbFallback = styled.div`
  font-size: 22px;
  line-height: 1;
`;

const MenuInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
`;

const MenuName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #000000;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MenuPrice = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #a5a5a5;
`;

const MenuBadge = styled.div`
  font-size: 12px;
  color: var(--main-color4);

  border-radius: 20px;
  background: var(--main-color2);

  padding: 3px 10px;
`;

// review

const ReviewWrap = styled.section`
  padding: 12px 20px;
`;

const ReviewCtaBtn = styled.button`
  font-size: 12px;
  color: var(--main-color4);

  width: 100%;
  height: 40px;

  border: none;
  border-radius: 20px;
  background: var(--main-color2);

  cursor: pointer;

  &:active {
    opacity: 0.9;
  }
`;

const ReviewList = styled.div`
  margin-top: 12px;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReviewItem = styled.article`
  width: 100%;
`;

const ReviewHeader = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
`;

const ReviewerAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 999px;

  overflow: hidden;
  background: #fff;
  border: 1px solid #eeeeee;

  flex: 0 0 auto;
`;

const ReviewerAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeaderMeta = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MetaTopRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const ReviewerName = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #000000;
`;

const ReviewDate = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #d5d5d5;
`;

const StarRow = styled.div`
  display: flex;
  gap: 3px;
`;

const StarSmall = styled.img`
  width: 14px;
  height: 14px;
  opacity: ${(p) => (p.$dim ? 0.25 : 1)};
`;

const ReviewBody = styled.div`
  margin-top: 16px;
`;

const ReviewTextWrap = styled.div`
  position: relative;
`;

const ReviewText = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #000000;

  line-height: 1.45;
  white-space: pre-line;

  overflow-wrap: anywhere;
  word-break: break-word;

  overflow: hidden;
  max-height: ${(p) =>
    p.$expanded ? "none" : `calc(${p.$clampLines} * 1.45em)`};

  position: relative;

  ${(p) =>
    !p.$expanded &&
    p.$canToggle &&
    `
    padding-bottom: 6px;

    &::after{
      content:'';
      position:absolute;
      left:0;
      right:0;
      bottom:0;
      height:18px;
      background: linear-gradient(to bottom, rgba(255,255,255,0), #fff);
      pointer-events:none;
    }
  `}
`;

const ReviewToggleRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ReviewToggleBtn = styled.button`
  border: 0;
  background: transparent;

  font-size: 12px;
  font-weight: 600;
  color: var(--main-color2);

  padding: 4px 6px;
  border-radius: 8px;
  cursor: pointer;

  &:active {
    opacity: 0.85;
  }

  &:focus-visible {
    outline: 2px solid rgba(0, 0, 0, 0.25);
    outline-offset: 2px;
  }
`;

const PhotoCarousel = styled.div`
  margin-top: 10px;
  position: relative;
`;

const PhotoTrack = styled.div`
  display: flex;
  gap: 8px;

  overflow-x: auto;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;

  scroll-snap-type: x mandatory;

  padding: 2px 2px 2px 2px;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    height: 0;
  }

  &:focus-visible {
    outline: 2px solid rgba(0, 0, 0, 0.18);
    outline-offset: 2px;
    border-radius: 12px;
  }
`;

const PhotoSlide = styled.div`
  flex: 0 0 auto;
  width: 120px;
  height: 120px;

  border-radius: 16px;
  overflow: hidden;

  background: #f7dfe2;
  border: 1px solid rgba(0, 0, 0, 0.06);

  scroll-snap-align: start;
`;

const PhotoSlideImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ReviewPhotoGrid = styled.div`
  margin-top: 10px;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;

  max-width: 270px;
`;

const ReviewPhotoItem = styled.div`
  position: relative;

  width: 120px;
  height: 120px;

  border-radius: 16px;
  overflow: hidden;

  background: #f7dfe2;
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

const ReviewPhotoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CarouselArrowBtn = styled.button`
  position: absolute;
  top: 50%;
  ${(p) => (p.$pos === "left" ? "left: 6px;" : "right: 6px;")}
  transform: translateY(-50%);

  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 0;

  display: grid;
  place-items: center;

  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);

  cursor: pointer;

  opacity: 0;
  pointer-events: none;

  ${PhotoCarousel}:hover & {
    opacity: 1;
    pointer-events: auto;
  }

  @media (hover: none), (pointer: coarse) {
    display: none;
  }

  &:disabled {
    opacity: 0 !important;
    pointer-events: none !important;
  }

  &:focus-visible {
    opacity: 1;
    pointer-events: auto;
    outline: 2px solid rgba(255, 255, 255, 0.8);
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(-50%) scale(0.96);
  }
`;

const CarouselArrowIcon = styled.img`
  width: 18px;
  height: 18px;
  transform: rotate(${(p) => (p.$flip ? "180deg" : "0deg")});
`;
