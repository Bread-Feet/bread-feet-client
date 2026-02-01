const logoImg = "/breed-feet-logo-login.png";
const kakaoLoginIcon = "/kakao_login_medium_wide.png";

import styled from "styled-components";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getApiUrl } from "../../config/env";
import { isPWAStandalone, openOAuthPopup } from "../../lib/oauth-popup";
import { markLoginSuccess } from "../../lib/api-client";
// import { useUserStore } from "../../store/userStore";
import { saveTokens } from "../../lib/token-storage.jsx";

function LoginContent() {
  const [searchParams] = useSearchParams();
  // const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  const [isAuthChecking, setIsAuthChecking] = useState(false);

  useEffect(() => {
    // login 후 원래 가려던 페이지로 돌아가기
    const returnUrl = searchParams.get("returnUrl");
    if (returnUrl) {
      sessionStorage.setItem("returnUrl", returnUrl);
    }
  }, [searchParams]);

  const handleSocialLogin = async (provider) => {
    const apiUrl = getApiUrl();

    // pwa standalone 모드에서는 popup 허용
    if (isPWAStandalone()) {
      setIsAuthChecking(true);
      try {
        const result = await openOAuthPopup(provider);

        if (result.success) {
          try {
            // const userData = await apiClient.get("/api/v1/members/me"); // 사용자 정보 가져오기

            // setUser({
            //   id: userData.id,
            //   nickname: userData.nickname,
            //   age: userData.age,
            //   email: userData.email,
            // });

            // token refresh time 초기화
            markLoginSuccess();

            // indexedDB에 토큰 저장 (access token만 refresh token 부분은 주석 처리)
            // if (result.tokens?.accessToken && result.tokens?.refreshToken) {
            if (result.tokens?.accessToken) {
              // refresh token 생길시 윗줄로 대체
              try {
                await saveTokens(
                  result.tokens.accessToken,
                  // result.tokens.refreshToken,
                );
                console.log(
                  "[Login] PWA tokens saved to IndexedDB from postMessage",
                );
              } catch (tokenError) {
                console.warn("[Login] PWA token save failed:", tokenError);
              }
            }

            const returnUrl = sessionStorage.getItem("returnUrl");
            if (returnUrl) {
              sessionStorage.removeItem("returnUrl");
              navigate(returnUrl);
            } else {
              navigate("/");
            }
          } catch (apiError) {
            console.error("[Login] Failed to fetch user data:", apiError);
          }
        } else {
          console.warn("[Login] OAuth completed but not successful:", result); // popup에서 성공 신호는 왔지만, success가 false인 케이스
        }
      } catch {
        // popup 차단 또는 취소 - 리다이렉트로 풀백
        console.warn("[Login] Popup OAuth failed, falling back to redirect");
        if (provider === "kakao") {
          window.location.href = `${apiUrl}/oauth/kakao/login`;
        }
      } finally {
        setIsAuthChecking(false);
      }
    }
    // 일반 브라우저에서는 리다이렉트 사용(pwa standalon 모드 X, popup 사용 X)
    else {
      if (provider === "kakao") {
        window.location.href = `${apiUrl}/oauth/kakao/login`;
      }
    }
  };

  return (
    <Page>
      <PhoneFrame>
        <Content>
          <Logo src={logoImg} alt="BreadFeet logo" />
          <Title>
            <span style={{ color: "var(--main-color2)" }}>Bread</span>
            <span style={{ color: "var(--main-color1)" }}>Feet</span>
          </Title>
          <Subtitle>빵을 위한 발걸음: 빵발자국</Subtitle>
          <Button
            onClick={() => handleSocialLogin("kakao")}
            disabled={isAuthChecking}
          >
            <img src={kakaoLoginIcon} alt="카카오로 로그인" />
          </Button>
          <BottomSpacer />
        </Content>
      </PhoneFrame>
    </Page>
  );
}

export default function LoginPage() {
  return (
    // 한번에 로딩하기
    <Suspense fallback={<div>로딩중...</div>}>
      <LoginContent />
    </Suspense>
  );
}

// styled components
const Page = styled.main`
  min-height: var(--app-100vh);
  height: var(--app-100vh);
  background: var(--main-color4);

  display: flex;
  align-items: center;
  justify-content: center;

  /* pwa iOS safe area */
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
`;

const PhoneFrame = styled.section`
  width: min(402px, 100vw);
  height: var(--app-100vh);

  max-height: var(--app-100vh);

  background: var(--main-color3);

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  width: 100%;
  padding: 32px 20px 40px;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  justify-content: center;
`;

const Logo = styled.img`
  width: min(220px, 80vw);
  height: auto;
  display: block;
  margin: 0 auto 18px;

  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.08));
  user-select: none;
  -webkit-user-drag: none;
`;

const Title = styled.h1`
  font-family: "Fredoka";

  margin: 0;
  font-size: clamp(43px, 10vw, 52px);
  line-height: 1.05;
  letter-spacing: -0.5px;

  text-shadow: 0 2px 0 rgba(255, 255, 255, 0.35);
`;

const Subtitle = styled.p`
  margin: 8px 0 43px 0;
  font-size: clamp(12px, 3.5vw, 14px);
  font-weight: 400;
  color: var(--main-color2);
`;

const Button = styled.button`
  cursor: pointer;

  font: inherit;
  color: inherit;
  background: transparent;
  border: none;

  text-align: center;

  img {
    display: block;
  }
`;

const BottomSpacer = styled.div`
  height: var(--app-10vh);
  max-height: 80px;
  min-height: 24px;
`;
