import styled from "styled-components";
import PageLayout from "../../components/layout/PageLayout";

const mascot = "/mascot.svg";
const exampleImg = "/examplePhoto.jpg";
const userIcon = "/UserCircle.svg";
const heart_on = "/heart_on.svg";
const heart_off = "/heart_off.svg";
const location = "/location_black.svg";

export default function HomePage() {
  const myRecs = [
    { id: 1, name: "르배 본점", distance: "900m", liked: false },
    { id: 2, name: "앙앙빵집", distance: "1.2km", liked: true },
  ];

  const todayRecs = [
    {
      id: 1,
      name: "성심당",
      location: "대전",
      liked: true,
      imageUrl: exampleImg,
    },
    {
      id: 2,
      name: "네이버",
      location: "청주",
      liked: false,
      imageUrl: exampleImg,
    },
  ];

  return (
    <PageLayout>
      <Wrap>
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
            <SearchInput placeholder="" />
          </SearchBar>
        </SearchWrap>

        <Main>
          <Section>
            <SectionTitle>나의 빵집 추천</SectionTitle>

            <Grid>
              {myRecs.map((b) => (
                <Item key={b.id}>
                  <Card>
                    <HeartBtn
                      type="button"
                      aria-label={b.liked ? "즐겨찾기 해제" : "즐겨찾기"}
                      aria-pressed={b.liked}
                    >
                      <HeartIcon src={b.liked ? heart_on : heart_off} />
                    </HeartBtn>

                    <CardMascot src={mascot} alt="" />
                  </Card>

                  <NameText>{b.name}</NameText>

                  <MetaRow>
                    <PinIcon src={location} />
                    <MetaText>{b.distance}</MetaText>
                  </MetaRow>
                </Item>
              ))}
            </Grid>
          </Section>

          <Section>
            <SectionTitle>오늘의 빵지순례 추천</SectionTitle>

            <Grid>
              {todayRecs.map((b) => (
                <Item key={b.id}>
                  <Card>
                    <CardImg src={b.imageUrl} alt="" />
                    <HeartBtn
                      type="button"
                      aria-label={b.liked ? "즐겨찾기 해제" : "즐겨찾기"}
                      aria-pressed={b.liked}
                    >
                      <HeartIcon src={b.liked ? heart_on : heart_off} />
                    </HeartBtn>
                  </Card>

                  <NameText>{b.name}</NameText>

                  <MetaRow>
                    <PinIcon src={location} />
                    <MetaText>{b.location}</MetaText>
                  </MetaRow>
                </Item>
              ))}
            </Grid>
          </Section>
        </Main>
      </Wrap>
    </PageLayout>
  );
}

const Wrap = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  background: var(--main-color2);
`;

const Header = styled.header`
  width: 100%;

  background: var(--main-color2);

  padding: 65px 0 70px 0;
  margin: auto;
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
  letter-spacing: 5%;

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

  background: white;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;

  padding: 15px 19px 0px 19px;
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
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  background: var(--main-color4);

  padding: 24px;
  margin-bottom: 92px;
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

const CardMascot = styled.img`
  width: 100%;
  height: auto;
`;

const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  color: #000000;

  margin-top: 16px;
  padding: 0 7px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
`;

const PinIcon = styled.img`
  width: 11px;
  height: 16px;
  flex: 0 0 auto;
`;

const MetaText = styled.div`
  font-size: 12px;
  color: #000000;
`;
