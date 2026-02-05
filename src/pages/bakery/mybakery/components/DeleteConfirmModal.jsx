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
    <Overlay onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
      <Modal role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
        <IconCircle aria-hidden="true">!</IconCircle>
        <Title id="delete-modal-title">빵집 정보를 삭제할까요?</Title>
        <Description>
          삭제한 정보는 다시 복구할 수 없어요.
          <br />
          정말 삭제하시겠어요?
        </Description>
        <ButtonRow>
          <CancelButton type="button" onClick={onClose}>
            취소
          </CancelButton>
          <DeleteButton type="button" onClick={onConfirm}>
            삭제하기
          </DeleteButton>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  padding: 20px;
`;

const Modal = styled.div`
  width: min(340px, calc(100vw - 40px));
  background: #fff;
  border-radius: 20px;
  padding: 24px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const IconCircle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 999px;
  background: #fdecec;
  color: #eb5757;
  font-size: 30px;
  font-weight: 700;
  display: grid;
  place-items: center;
  margin-bottom: 12px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f1f1f;
`;

const Description = styled.p`
  margin: 12px 0 20px;
  font-size: 14px;
  line-height: 1.4;
  color: #6f6f6f;
`;

const ButtonRow = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const BaseButton = styled.button`
  height: 44px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
`;

const CancelButton = styled(BaseButton)`
  background: #eeeeee;
  color: #707070;
`;

const DeleteButton = styled(BaseButton)`
  background: #eb5757;
  color: #ffffff;
`;

