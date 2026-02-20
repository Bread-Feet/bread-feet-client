import styled from "styled-components";

import PageLayout from "../../components/layout/PageLayout";
import SearchBar from "../../components/SearchBar";
import BakeryCard from "./BakeryCard";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import useSearch from "../../hooks/useSearch";
import useMyBakeries from "./hooks/useMyBakeries";

export default function BakeryAdminPage() {
  const nav = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { query, debouncedQuery, setQuery, clearQuery } = useSearch();
  const { bakeries } = useMyBakeries(debouncedQuery);

  const openModifyPage = () => {
    nav("/mybakery/modify");
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <PageLayout>
      <Header>
        <Title>나의 빵집</Title>
        <SearchBar value={query} onChange={setQuery} onClear={clearQuery} />
      </Header>
      <ButtonWrapper>
        <RegisterButton onClick={() => nav("/mybakery/register")}>
          빵집 등록하기
        </RegisterButton>
      </ButtonWrapper>
      <Scroll>
        {bakeries.map((b) => (
          <BakeryCard
            key={b.bakeryId}
            name={b.name}
            rating={b.averageRating}
            reviewCount={b.reviewCount}
            address={[b.address?.roadAddress, b.address?.detail]
              .filter(Boolean)
              .join(" ")}
            onModifyClick={openModifyPage}
            onDeleteClick={openDeleteModal}
          />
        ))}
      </Scroll>
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </PageLayout>
  );
}

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
