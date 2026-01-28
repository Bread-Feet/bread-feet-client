import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "Pretendard";
    src: url("/fonts/Pretendard-Thin.woff2") format("woff2");
    font-weight: 100;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("/fonts/Pretendard-ExtraLight.woff2") format("woff2");
    font-weight: 200;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("/fonts/Pretendard-Light.woff2") format("woff2");
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("/fonts/Pretendard-Regular.woff2") format("woff2");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("/fonts/Pretendard-Medium.woff2") format("woff2");
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("/fonts/Pretendard-SemiBold.woff2") format("woff2");
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("/fonts/Pretendard-Bold.woff2") format("woff2");
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Pretendard";
    src: url("/fonts/Pretendard-ExtraBold.woff2") format("woff2");
    font-weight: 800;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Fredoka";
    src: url("/fonts/FredokaOne-Regular.woff2") format("woff2");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  :root {
    --main-color1: #ffdc8b;
    --main-color2: #7c4628;
    --main-color3: #f8edd0;
    --main-color4: #ffffff;

    --gray-color: #9e9e9e;
    --red-color: #ff383c;

    --page-padding: 20px;

    --app-100vh: 100vh;
    --app-10vh: 10vh;

    --tabbar-height: 92px;
  }

  @supports (height: 100dvh) {
    :root {
      --app-100vh: 100dvh;
      --app-10vh: 10dvh;
    }
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    font-family: "Pretendard", system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans KR", sans-serif;
  }

  body.no-scroll {
    overflow: hidden;
  }
`;
