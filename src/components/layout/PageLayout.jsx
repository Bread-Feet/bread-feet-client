import styled from "styled-components";

export default function PageLayout({ children, frameStyle }) {
  return (
    <Page>
      <PhoneFrame $frameStyle={frameStyle}>
        {children}
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
  ${(p) => p.$frameStyle}
`;
