import styled from "styled-components";

import PageLayout from "../../components/layout/PageLayout";
import SearchBar from "../../components/SearchBar";
import BakeryCard from "./BakeryCard";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import MoveBakeryPage from "../../components/MoveBakeryPage";

import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useSearch from "../../hooks/useSearch";
import useMyBakeries from "./hooks/useMyBakeries";
import useBakery from "../../hooks/useBakery";

export default function BakeryAdminPage() {
  const nav = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sort, setSort] = useState("");
  const [deletingBakeryId, setDeletingBakeryId] = useState(null);
  const { query, debouncedQuery, setQuery, clearQuery } = useSearch();
  const { bakeries, isLoading, hasMore, loadMore, refresh } = useMyBakeries(
    debouncedQuery,
    sort,
  );
  const sentinelRef = useRef(null);

  const { remove, isDeleting } = useBakery();
  const [deleteErrorVisible, setDeleteErrorVisible] = useState(false);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) loadMore();
  }, [isLoading, hasMore, loadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) handleLoadMore();
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  const openModifyPage = (bakeryId) => {
    nav(`/mybakery/${bakeryId}/modify`);
  };

  const openDeleteModal = (bakeryId) => {
    setDeleteErrorVisible(false);
    setDeletingBakeryId(bakeryId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteErrorVisible(false);
    setIsDeleteModalOpen(false);
    setDeletingBakeryId(null);
  };

  const confirmDelete = async () => {
    setDeleteErrorVisible(false);
    const result = await remove(deletingBakeryId);
    if (result === null) {
      setDeleteErrorVisible(true);
      return;
    }
    setIsDeleteModalOpen(false);
    setDeletingBakeryId(null);
    refresh();
  };

  return (
    <PageLayout>
      <Header>
        <MoveBakeryPage />
        <SearchBar value={query} onChange={setQuery} onClear={clearQuery} />
      </Header>
      <ButtonWrapper>
        <RegisterButton onClick={() => nav("/mybakery/register")}>
          빵집 등록하기
        </RegisterButton>
      </ButtonWrapper>
      <SortWrapper>
        <SortButton active={sort === ""} onClick={() => setSort("")}>
          최신순
        </SortButton>
        <Divider>|</Divider>
        <SortButton active={sort === "NAME"} onClick={() => setSort("NAME")}>
          이름순
        </SortButton>
      </SortWrapper>
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
            onModifyClick={() => openModifyPage(b.bakeryId)}
            onDeleteClick={() => openDeleteModal(b.bakeryId)}
          />
        ))}
        <Sentinel ref={sentinelRef} />
      </Scroll>
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        disabled={isDeleting}
        errorMessage={
          deleteErrorVisible ? "삭제에 실패했습니다. 다시 시도해주세요." : null
        }
      />
    </PageLayout>
  );
}

const Header = styled.header`
  width: 100%;

  background: #f8edd0;
  background: linear-gradient(
    rgba(248, 237, 208, 1) 0%,
    rgba(255, 255, 255, 1) 100%
  );

  padding: 57px var(--page-padding) 10px var(--page-padding);
`;

const Sentinel = styled.div`
  height: 1px;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  padding: 12px 20px 0 20px;
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

const SortWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 20px;
  gap: 8px;
`;

const SortButton = styled.button`
  border: none;
  background: none;
  font-size: 12px;
  cursor: pointer;
  color: ${(props) => (props.active ? "var(--main-color1)" : "#999999")};
  font-weight: ${(props) => (props.active ? "600" : "400")};
`;

const Divider = styled.span`
  font-size: 10px;
  color: #eeeeee;
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
