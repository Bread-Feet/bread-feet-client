import styled from "styled-components";
const arrow_left = "/arrow_left_black.svg";

import PageLayout from "../../../components/layout/PageLayout";

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useBakery from "../../../hooks/useBakery";
import useBakeryInfo from "./hooks/useBakeryInfo";
import useOperatingHours from "./hooks/useOperatingHours";
import useStoreTags from "./hooks/useStoreTags";
import useMenuManager from "./hooks/useMenuManager";
import useBakerySubmit from "./hooks/useBakerySubmit";
import { makeBakeryDraftBody } from "./utils/makeBakeryBody";

import BakeryInfoSection from "./sections/BakeryInfoSection";
import OperationSection from "./sections/OperationSection";
import MenuSection from "./sections/MenuSection";

export default function BakeryModifyPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { bakery, isLoading, error, load } = useBakery(id);

  useEffect(() => {
    load();
  }, [load]);

  if (isLoading || (!bakery && !error)) {
    return (
      <PageLayout>
        <Header>
          <ActionButton onClick={() => nav("/mybakery")}>
            <Image src={arrow_left} alt="뒤로가기" />
          </ActionButton>
          <Title>수정하기</Title>
        </Header>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <Header>
          <ActionButton onClick={() => nav("/mybakery")}>
            <Image src={arrow_left} alt="뒤로가기" />
          </ActionButton>
          <Title>수정하기</Title>
        </Header>
        <p style={{ padding: "20px", textAlign: "center" }}>
          데이터를 불러오지 못했습니다.
        </p>
      </PageLayout>
    );
  }

  return <BakeryModifyForm bakery={bakery} />;
}

function BakeryModifyForm({ bakery }) {
  const { id } = useParams();
  const nav = useNavigate();

  const bakeryInfo = useBakeryInfo(bakery);
  const operatingHours = useOperatingHours(bakery);
  const tags = useStoreTags(bakery);
  const menuManager = useMenuManager(bakery);

  const { submitUpdate, isSubmitting } = useBakerySubmit();

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
        existingImageUrl: bakeryInfo.mainPhotoPreview,
        menuPhotos: validMenus.map((m) => m?.photo ?? null),
        existingMenuUrls: validMenus.map((m) => m?.photoPreview ?? null),
      };

      await submitUpdate({ bakeryId: Number(id), draftBody, files });
      alert("빵집 수정 완료");
      nav("/mybakery");
    } catch (err) {
      console.error(err);
      alert(err?.message || "수정에 실패했습니다.");
    }
  };

  return (
    <PageLayout>
      <Header>
        <ActionButton onClick={() => nav("/mybakery")}>
          <Image src={arrow_left} alt="뒤로가기" />
        </ActionButton>
        <Title>수정하기</Title>
      </Header>
      <Form onSubmit={handleSubmit}>
        <BakeryInfoSection {...bakeryInfo} />
        <OperationSection {...operatingHours} {...tags} />
        <MenuSection {...menuManager} />
        <SubmitButton disabled={isSubmitting}>
          {isSubmitting ? "수정 중..." : "빵집 정보 수정하기"}
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
