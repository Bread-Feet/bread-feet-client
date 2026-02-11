import styled from "styled-components";
const arrow_left = "/arrow_left_white.svg";
const heart = "/heart_off.svg";
const star = "/starIcon.svg";
const location = "/location.svg";
const tell = "/tell.svg";
const link = "/link.svg";
const clock = "/clock.svg";
const dropboxIcon = "/dropboxIcon.svg";

import PageLayout from "../../components/layout/PageLayout";

import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TAB_ORDER = ["home", "menu", "review"];

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
        { day: "월요일", time: "09:00 - 18:00" },
        { day: "화요일", time: "09:00 - 18:00" },
        { day: "수요일", time: "09:00 - 18:00" },
        { day: "목요일", time: "09:00 - 18:00" },
        { day: "금요일", time: "09:00 - 18:00" },
        { day: "토요일", time: "00:00 - 00:00" },
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
            <CircleBtn type="button" aria-label="즐겨찾기">
              <HeartIcon src={heart} alt="" aria-hidden="true" />
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
            <HomeSection bakery={bakery} />
          ) : tab === "menu" ? (
            <MenuSection menus={bakery.menus} bestBread={bakery.bestBread} />
          ) : (
            <Placeholder>
              <PlaceholderTitle>TODO</PlaceholderTitle>
            </Placeholder>
          )}
        </Card>
      </Scroll>
    </PageLayout>
  );
}

// home section
function HomeSection({ bakery }) {
  const isClosed = !bakery.isOpen;
  const [hoursOpen, setHoursOpen] = useState(false);
  const hoursPanelId = `hours-panel-${bakery.id}`;

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
          onClick={() => setHoursOpen((v) => !v)}
          aria-expanded={hoursOpen}
          aria-controls={hoursPanelId}
          aria-label="영업시간 펼치기"
        >
          <InfoIconWrap>
            <ClockIcon src={clock} />
          </InfoIconWrap>
          <OpenStatus $closed={isClosed}>
            {isClosed ? "영업종료" : "영업중"}
          </OpenStatus>
          <ChevronIcon src={dropboxIcon} $open={hoursOpen} />
        </InfoRowButton>
        {hoursOpen && (
          <HoursDropdown id={hoursPanelId}>
            <HoursList>
              {bakery.businessHours?.map((h) => (
                <HoursItem key={h.day}>
                  <HoursDay>{h.day}</HoursDay>
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
`;

const OpenStatus = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${(p) => (p.$closed ? "var(--red-color)" : "#000000")};
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

const Placeholder = styled.div`
  border-radius: 16px;
  border: 1px dashed #e6e6e6;

  margin-top: 18px;
  padding: 22px 14px;
`;

const PlaceholderTitle = styled.div`
  font-weight: 900;
  margin-bottom: 6px;
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
