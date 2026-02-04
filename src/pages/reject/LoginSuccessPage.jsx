import styled, { keyframes } from "styled-components";

import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore.jsx";
import { useEffect } from "react";
import { markLoginSuccess } from "../../lib/api-client.jsx";
import { apiClient } from "../../lib/api-client.jsx";
import { isPWAStandalone } from "../../lib/oauth-popup.jsx";
import { saveTokens } from "../../lib/token-storage.jsx";

export default function LoginSuccessPage() {
  const navigate = useNavigate();
  const { setUser, setLoading } = useUserStore();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);

        // console.log("Fetching user info from:", getApiUrl());
        // const userData = await apiClient.get("/api/v1/members/me");

        // setUser({
        //   id: userData.id,
        //   nickname: userData.nickname,
        //   age: userData.age,
        //   email: userData.email,
        // });

        markLoginSuccess();

        if (isPWAStandalone()) {
          try {
            const tokens = await apiClient.post("/api/v1/auth/token-exchange");

            // indexedDB에 토큰 저장 (access token만 refresh token 부분은 주석 처리)
            // if (tokens && tokens.accessToken && tokens.refreshToken) {
            if (tokens && tokens.accessToken) {
              // refresh token 생길시 윗줄로 대체
              await saveTokens(
                tokens.accessToken,
                // tokens.refreshToken,
              );
              console.log("[LoginSuccess] PWA tokens saved to IndexedDB");
            }
          } catch (tokenError) {
            console.warn(
              "[LoginSuccess] Failed to save PWA tokens:",
              tokenError,
            );
          }
        }

        const isSafeReturnUrl = (url) =>
          typeof url === "string" &&
          url.startsWith("/") &&
          !url.startsWith("//");

        const returnUrl = sessionStorage.getItem("returnUrl");
        const safeReturnUrl = isSafeReturnUrl(returnUrl);
        if (safeReturnUrl) {
          sessionStorage.removeItem("returnUrl");
          navigate(returnUrl, { replace: true }); // 로그인 페이지 오기 이전 페이지로 이동
        } else {
          navigate("/", { replace: true }); // returnUrl 없을시, 메인 페이지로 이동
        }
      } catch (error) {
        console.error("로그인 정보를 가져오는데 실패했습니다:", error);
        navigate("/login", { replace: true }); // error 발생시 다시 login page로 이동
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate, setUser, setLoading]);

  return (
    <Page>
      <Center>
        <Spinner aria-label="loading" />
        <Message>로그인중 입니다...</Message>
      </Center>
    </Page>
  );
}

// styled components
const Page = styled.div`
  min-height: var(--app-100vh);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
`;

const Center = styled.div`
  text-align: center;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  margin: 0 auto 16px;
  display: inline-block;

  border-radius: 9999px;
  border: 4px solid var(--primary-600, #9b9b9b);
  border-top-color: transparent;

  animation: ${spin} 1s linear infinite;
`;

const Message = styled.p`
  font-size: 18px;
  color: var(--neutral-600, #000000);
`;
