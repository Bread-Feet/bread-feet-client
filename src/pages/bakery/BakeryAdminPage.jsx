import styled from "styled-components";
import { useEffect } from "react";
import SearchBar from "./SearchBar";
import BakeryCard from "./BakeryCard";
import TabBar from "../../components/TabBar";

export default function BakeryAdminPage() {
  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  return (
    <Page>
      <PhoneFrame>
        <Header>
          <Title>나의 빵집</Title>
          <SearchBar />
        </Header>
        <ButtonWrapper>
          <RegisterButton>빵집 등록하기</RegisterButton>
        </ButtonWrapper>
        <Scroll>
          <BakeryCard />
          <BakeryCard />
          <BakeryCard />
          <BakeryCard />
          <BakeryCard />
          <BakeryCard />
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

const RegisterButton = styled.button`
  font-size: 12px;
  font-weight: 600;

  border: none;
  border-radius: 999px;
  background: var(--main-color2);
  color: var(--main-color4);
  cursor: pointer;

  width: 100%;
  padding: 9px 0;
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
