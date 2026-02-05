import styled from "styled-components";
import arrow_left from "/arrow_left.svg";

import { useNavigate } from "react-router-dom";

import useBakeryInfo from "./hooks/useBakeryInfo";
import useOperatingHours from "./hooks/useOperatingHours";
import useStoreTags from "./hooks/useStoreTags";
import useMenuManager from "./hooks/useMenuManager";

import BakeryInfoSection from "./sections/BakeryInfoSection";
import OperationSection from "./sections/OperationSection";
import MenuSection from "./sections/MenuSection";

export default function BakeryFormPage({ title }) {
  const nav = useNavigate();

  const bakeryInfo = useBakeryInfo();
  const operatingHours = useOperatingHours();
  const storeTags = useStoreTags();
  const menuManager = useMenuManager();

  return (
    <Page>
      <PhoneFrame>
        <Header>
          <ActionButton onClick={() => nav("/mybakery")}>
            <Image src={arrow_left} alt="뒤로가기" />
          </ActionButton>
          <Title>{title}</Title>
        </Header>
        <Form>
          <BakeryInfoSection {...bakeryInfo} />
          <OperationSection {...operatingHours} {...storeTags} />
          <MenuSection {...menuManager} />
          <SubmitButton>완료</SubmitButton>
        </Form>
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

  background: var(--main-color4);
  padding: 58px var(--page-padding) 10px var(--page-padding);
  border-bottom: solid 1px #d9d9d9;

  display: grid;
  grid-template-columns: 48px 1fr 48px;
  align-items: center;
  justify-items: center;
`;

const ActionButton = styled.button`
  border: none;
  background: transparent;

  cursor: pointer;
`;

const Image = styled.img``;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;

  margin: 0;
`;

const Form = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  flex: 1;
  min-height: 0;

  overflow-y: auto;

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

const SubmitButton = styled.button`
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  color: var(--main-color4);

  width: calc(100% - 26px);

  border: none;
  border-radius: 20px;
  background: var(--main-color2);

  padding: 18px 0;
  margin: auto;
  margin-top: 99px;
  margin-bottom: 18px;

  cursor: pointer;
`;
