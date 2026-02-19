import styled from "styled-components";
const arrow_left = "/arrow_left_black.svg";

import PageLayout from "../../../components/layout/PageLayout";

import { useNavigate } from "react-router-dom";

import useBakeryInfo from "./hooks/useBakeryInfo";
import useOperatingHours from "./hooks/useOperatingHours";
import useStoreTags from "./hooks/useStoreTags";
import useMenuManager from "./hooks/useMenuManager";
import useBakerySubmit from "./hooks/useBakerySubmit";
import { makeBakeryDraftBody } from "./utils/makeBakeryBody";

import BakeryInfoSection from "./sections/BakeryInfoSection";
import OperationSection from "./sections/OperationSection";
import MenuSection from "./sections/MenuSection";

export default function BakeryCreatePage() {
  const nav = useNavigate();

  const bakeryInfo = useBakeryInfo();
  const operatingHours = useOperatingHours();
  const tags = useStoreTags();
  const menuManager = useMenuManager();

  const { submitCreate, isSubmitting } = useBakerySubmit();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const draftBody = makeBakeryDraftBody({
        bakeryInfo,
        operatingHours,
        tags,
        menuManager,
      });

      const validMenus = Array.isArray(menuManager.menus)
        ? menuManager.menus.filter(
            (m) => typeof m?.name === "string" && m.name.trim().length > 0,
          )
        : [];

      const files = {
        mainPhoto: bakeryInfo.mainPhoto,
        menuPhotos: validMenus.map((m) => m?.photo ?? null),
      };

      await submitCreate({ draftBody, files });
      alert("빵집 등록 완료");
      nav("/mybakery");
    } catch (err) {
      console.error(err);
      alert(err?.message || "등록에 실패했습니다.");
    }
  };

  return (
    <PageLayout>
      <Header>
        <ActionButton onClick={() => nav("/mybakery")}>
          <Image src={arrow_left} alt="뒤로가기" />
        </ActionButton>
        <Title>빵집 등록하기</Title>
      </Header>
      <Form onSubmit={handleSubmit}>
        <BakeryInfoSection {...bakeryInfo} />
        <OperationSection {...operatingHours} {...tags} />
        <MenuSection {...menuManager} />
        <SubmitButton disabled={isSubmitting}>
          {isSubmitting ? "등록 중..." : "빵집 등록하기"}
        </SubmitButton>
      </Form>
    </PageLayout>
  );
}

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

const Form = styled.form`
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
