import { useEffect } from "react";
import styled from "styled-components";

export default function DeleteConfirmModal({ open, onClose, onConfirm }) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Overlay
      onMouseDown={(event) =>
        event.target === event.currentTarget && onClose?.()
      }
    >
      <Modal
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <IconCircle aria-hidden="true">!</IconCircle>
        <Title id="delete-modal-title">빵집 정보를 삭제할까요?</Title>
        <Description>
          정말로 이 빵집을 삭제하시겠습니까?
          <br />
          삭제된 내용은 복구할 수 없습니다.
        </Description>
        <ButtonRow>
          <CancelButton type="button" onClick={onClose}>
            취소
          </CancelButton>
          <DeleteButton type="button" onClick={() => onConfirm?.()}>
            삭제하기
          </DeleteButton>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  display: grid;
  place-items: center;

  background: rgba(0, 0, 0, 0.45);

  position: fixed;
  inset: 0;
  z-index: 1000;
`;

const Modal = styled.div`
  width: min(300px, calc(100vw - 40px));

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  background: #fff;
  border-radius: 20px;

  padding: 40px 16px 16px 16px;
`;

const IconCircle = styled.div`
  font-size: 40px;
  font-weight: 600;
  color: #ff0000;

  width: 56px;
  height: 56px;

  background: #ffe8e8;
  border-radius: 999px;

  display: grid;
  place-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #000000;

  margin: 0;
`;

const Description = styled.p`
  font-size: 12px;
  color: #a5a5a5;

  margin: 8px 0 28px;
`;

const ButtonRow = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const BaseButton = styled.button`
  font-size: 14px;
  font-weight: 600;

  height: 56px;

  border: none;
  border-radius: 20px;

  cursor: pointer;
`;

const CancelButton = styled(BaseButton)`
  color: #a5a5a5;

  background: #f8f9fa;
`;

const DeleteButton = styled(BaseButton)`
  color: var(--main-color4);

  background: var(--red-color);
`;
