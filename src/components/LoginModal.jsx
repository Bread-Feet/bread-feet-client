import styled from "styled-components";

export default function LoginModal({ onConfirm, onClose }) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalCloseBtn type="button" onClick={onClose} aria-label="닫기">
          ×
        </ModalCloseBtn>
        <ModalMessage>
          로그인 후 사용할 수 있습니다
          <br /> 로그인 하시겠습니까?
        </ModalMessage>
        <ModalConfirmBtn type="button" onClick={onConfirm}>
          네
        </ModalConfirmBtn>
      </ModalBox>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  position: relative;
  width: 280px;
  background: #fff;
  border-radius: 20px;
  padding: 36px 24px 24px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const ModalCloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 16px;

  border: 0;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  color: #9e9e9e;
  cursor: pointer;

  &:active {
    opacity: 0.7;
  }
`;

const ModalMessage = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin: 0;
  text-align: center;
`;

const ModalConfirmBtn = styled.button`
  font-size: 15px;
  font-weight: 600;
  color: var(--main-color4);

  width: 100%;
  padding: 13px 0;

  border: 0;
  border-radius: 14px;
  background: var(--main-color2);

  cursor: pointer;

  &:active {
    opacity: 0.85;
  }
`;
