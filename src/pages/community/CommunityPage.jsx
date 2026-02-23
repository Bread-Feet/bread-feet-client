import styled from "styled-components";

import PageLayout from "../../components/layout/PageLayout";
const location = "/location_brown.svg";
const mascot = "/mascot.svg";
const roll_bread = "/roll_bread.svg";

import { useNavigate } from "react-router-dom";
import { useMemo, useState, useCallback } from "react";

export default function CommunityPage() {
  const nav = useNavigate();
  const [tab, setTab] = useState("ALL"); // "ALL" | "MINE"

  const goBakery = useCallback((bakeryId) => nav(`/bakery/${bakeryId}`), [nav]);
  const goPost = useCallback((postId) => {
    console.log("TODO: go post detail:", postId);
  }, []);

  const posts = useMemo(
    () => [
      {
        id: 1,
        bakeryId: 1,
        bakeryName: "가가빵집",
        userName: "논서",
        title: "크루아상이 맛있는 빵집",
        content:
          "빵 엄청ㅁ엄ㅊ엄 맛있다...!!!!!!!!!!~~~~~~~~~~~~~ㅎㅎㅎ엄마랑 아빠랑 왔따 ㅎㅎㅎㅎㅎㅎ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~!~......",
      },
      {
        id: 2,
        bakeryId: 2,
        bakeryName: "나나빵집",
        userName: "곤서",
        title: "폭신식빵이 맛있는 빵집",
        content:
          "엄마아빠랑같이 먹으러 왓따 진짜 폭신폭신하고 말랑말랑 내가 먹어본빵중 최고의 빵인것같다 강추드려오!!!!!!!!!!!근데 안에 크림이 적당히 달면서먹......",
      },
    ],
    [],
  );

  const filtered = useMemo(() => {
    if (tab === "MINE") return posts.slice(1, 2); // TODO : 내꺼만 찾도록
    return posts;
  }, [posts, tab]);

  return (
    <PageLayout>
      <Screen>
        <Header>
          <HeaderTitle>커뮤니티</HeaderTitle>
        </Header>

        <Main>
          <TabRow role="tablist" aria-label="커뮤니티 탭">
            <TabBtn
              type="button"
              role="tab"
              aria-selected={tab === "ALL"}
              $active={tab === "ALL"}
              onClick={() => setTab("ALL")}
            >
              전체
            </TabBtn>
            <TabBtn
              type="button"
              role="tab"
              aria-selected={tab === "MINE"}
              $active={tab === "MINE"}
              onClick={() => setTab("MINE")}
            >
              나의 빵집
            </TabBtn>
          </TabRow>

          <List>
            {filtered.map((p) => (
              <PostCard
                key={p.id}
                onClick={() => goPost(p.id)}
                role="button"
                tabIndex={0}
              >
                <StickerWrap aria-hidden>
                  <StickerImg src={roll_bread} alt="" />
                </StickerWrap>

                <CardTop
                  onClick={(e) => {
                    e.stopPropagation();
                    goBakery(p.bakeryId);
                  }}
                >
                  <PinIcon aria-hidden src={location} />
                  <BakeryTitle>{p.bakeryName}</BakeryTitle>
                </CardTop>

                <DashLine aria-hidden />

                <CardBody>
                  <ProfileWrapper>
                    <Avatar aria-hidden src={mascot} />
                    <UserName>{p.userName}</UserName>
                  </ProfileWrapper>

                  <BodyText>
                    <CardTitle>{p.title}</CardTitle>
                    <Content>{p.content}</Content>
                  </BodyText>
                </CardBody>
              </PostCard>
            ))}
          </List>
        </Main>
      </Screen>
    </PageLayout>
  );
}

const Screen = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--main-color4, #ffffff);
`;

const Header = styled.header`
  width: 100%;
  height: 110px;

  display: flex;
  flex-direction: column-reverse;
  background: #f8edd0;

  padding: 18px 20px;
`;

const HeaderTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #000000;

  margin: 0;
`;

const Main = styled.main`
  flex: 1 1 auto;
  overflow: auto;

  width: 100%;

  padding: 12px 20px;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabRow = styled.div`
  width: 100%;

  display: flex;
  justify-content: flex-start;

  gap: 12px;
  margin-bottom: 13px;
`;

const TabBtn = styled.button`
  font-size: 12px;
  font-weight: 600;
  color: ${(p) => (p.$active ? "#ffffff" : " #ab9d8b")};

  min-width: 100px;

  border-radius: 999px;
  border: 2px solid ${(p) => (p.$active ? "transparent" : "#ab9d8b")};
  background: ${(p) => (p.$active ? "#ab9d8b" : "#ffffff")};

  padding: 8px 0;
`;

const List = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;

  padding: 0 15px;
`;

const PostCard = styled.button`
  position: relative;

  width: 100%;

  background: #fffcf5;
  border: 1.5px solid #ab9d8b;
  border-radius: 10px;
  appearance: none;
  -webkit-appearance: none;

  padding: 0 16px;

  cursor: pointer;
`;

const StickerWrap = styled.div`
  position: absolute;
  top: -10px;
  right: 30px;

  width: 86px;
  height: 83px;

  display: grid;
  place-items: center;

  z-index: 5;

  pointer-events: none;
`;

const StickerImg = styled.img`
  object-fit: contain;
  transform: rotate(20deg);

  display: block;
`;

const CardTop = styled.button`
  display: flex;
  align-items: center;
  gap: 1px;
  background: none;
  border: none;

  padding: 8px 5px;

  cursor: pointer;
`;

const PinIcon = styled.img``;

const BakeryTitle = styled.span`
  font-size: 10px;
  font-weight: 400;
  color: #000000;
`;

const DashLine = styled.div`
  width: 100%;
  height: 1.5px;
  background-image: repeating-linear-gradient(
    to right,
    rgba(171, 157, 139, 0.85) 0px,
    rgba(171, 157, 139, 0.85) 10px,
    transparent 10px,
    transparent 18px
  );
  opacity: 0.55;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;

  gap: 6px;
  padding: 8px 0 18px 0;
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;

  border-radius: 999px;
  border: 1px solid #cfc6b9;
  background: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
`;

const UserName = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: var(--text-muted, #6f6a62);
  margin-bottom: 4px;
`;

const BodyText = styled.div`
  min-width: 0;
`;

const CardTitle = styled.h2`
  font-size: 12px;
  font-weight: 500;
  color: #000000;

  margin: 0 8px 5px 8px;
`;

const Content = styled.p`
  font-size: 10px;
  color: #ab9d8b;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-line;

  margin: 0 4px;
`;
