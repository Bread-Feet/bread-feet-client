import styled from "styled-components";

import SearchBar from "../bakery/SearchBar";
import BakeryCard from "./BakeryCard";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

const logoImg = "/menu_example_img.svg";

export default function BakeryPage() {
  const nav = useNavigate();
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
    <Page>
      <PhoneFrame>
        <Header>
          <Title>나의 빵집</Title>
          <SearchBar />
        </Header>
        <ButtonWrapper></ButtonWrapper>
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
            />
          ))}
        </Scroll>
      </PhoneFrame>
    </Page>
  );
}

const Page = styled.main`
  min-height: var(--app-100vh);
  height: var(--app-100vh);
  background: var(--main-color4);

  display: flex;
  align-items: center;
  justify-content: center;

  /* pwa iOS safe area */
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
`;

const PhoneFrame = styled.section`
  width: min(402px, 100vw);
  height: var(--app-100vh);

  max-height: var(--app-100vh);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

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
  padding: 12px 20px;
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
