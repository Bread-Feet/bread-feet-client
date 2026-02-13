import styled, { keyframes } from "styled-components";

import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore.jsx";
import { useEffect } from "react";
import { markLoginSuccess } from "../../lib/api-client.js";
import { apiClient } from "../../lib/api-client.js";
import { isPWAStandalone } from "../../lib/oauth-popup.js";
import { saveTokens } from "../../lib/token-storage.js";

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

            // indexedDB??? í° ?€??(access tokenë§?refresh token ë¶€ë¶„ì? ì£¼ì„ ì²˜ë¦¬)
            // if (tokens && tokens.accessToken && tokens.refreshToken) {
            if (tokens && tokens.accessToken) {
              // refresh token ?ê¸¸???—ì¤„ë¡??€ì²?
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
          navigate(returnUrl, { replace: true }); // ë¡œê·¸???˜ì´ì§€ ?¤ê¸° ?´ì „ ?˜ì´ì§€ë¡??´ë™
        } else {
          navigate("/", { replace: true }); // returnUrl ?†ì„?? ë©”ì¸ ?˜ì´ì§€ë¡??´ë™
        }
      } catch (error) {
        console.error("ë¡œê·¸???•ë³´ë¥?ê°€?¸ì˜¤?”ë° ?¤íŒ¨?ˆìŠµ?ˆë‹¤:", error);
        navigate("/login", { replace: true }); // error ë°œìƒ???¤ì‹œ login pageë¡??´ë™
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
        <Message>ë¡œê·¸?¸ì¤‘ ?…ë‹ˆ??..</Message>
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


