import styled, { keyframes } from "styled-components";

import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { OAUTH_STORAGE_KEY, OAUTH_CHANNEL_NAME } from "../../lib/oauth-popup";
import { getApiUrl } from "../../config/env";
import { markLoginSuccess } from "../../lib/api-client";
import { saveTokens } from "../../lib/token-storage.jsx";

export default function LoginPopupCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // React 18 StrictMode(dev)에서 useEffect가 2번 실행될 수 있어 중복 실행 방지
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const handleCallback = async () => {
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");
      const code = searchParams.get("code");
      const tokenParam = searchParams.get("token");
      const mode = searchParams.get("mode");
      let token = null;
      let tokens = null;

      if (tokenParam) {
        try {
          const decoded = decodeURIComponent(tokenParam);
          const parsed = JSON.parse(decoded);
          if (parsed && typeof parsed === "object") {
            tokens = parsed;
            token = parsed.accessToken || null;
          } else {
            token = decoded;
            tokens = { accessToken: decoded };
          }
        } catch {
          token = tokenParam;
          tokens = { accessToken: tokenParam };
        }
      }

      if (!token && code) {
        console.log("[PopupCallback] code:", code);
        console.log("[PopupCallback] exchange start");
        const apiUrl = getApiUrl();
        const exchangeUrl = `${apiUrl}/login/oauth2/code/kakao?code=${encodeURIComponent(
          code,
        )}`;
        // backend redirects to frontend with token; avoid fetch to bypass CORS
        window.location.href = exchangeUrl;
        return;
      }

      const success = !error && (code || token || tokens);
      const oauthResult = {
        type: "OAUTH_COMPLETE",
        payload: success
          ? {
              success: true,
              code,
              token,
              tokens,
            }
          : {
              success: false,
              error: error || "oauth_error",
              errorDescription: errorDescription || null,
            },
      };

      const isPopupWindow =
        typeof window !== "undefined" &&
        (window.name === "breadfeetOAuth" || mode === "popup");

      if (!isPopupWindow && success && tokens?.accessToken) {
        try {
          await saveTokens(tokens.accessToken);
          markLoginSuccess();
          console.log("[PopupCallback] Tokens saved to IndexedDB");
        } catch (tokenError) {
          console.warn("[PopupCallback] Token save failed:", tokenError);
        }
      }

      // oauth-popup.jsx로 전달
      // 1 - BroadcastChannel
      try {
        const channel = new BroadcastChannel(OAUTH_CHANNEL_NAME);
        channel.postMessage(oauthResult);
        channel.close();
        console.log("[PopupCallback] Sent result via BroadcastChannel");
      } catch {
        console.log("[PopupCallback] BroadcastChannel not supported");
      }

      // 2 - postMessage (window.opener가 살아있을 때. 즉 popup이 안닫힌 경우)
      if (window.opener) {
        try {
          window.opener.postMessage(oauthResult, window.location.origin);
          console.log("[PopupCallback] Sent result via postMessage");
        } catch (error) {
          console.error("[PopupCallback] postMessage failed:", error);
        }
      } else {
        console.log(
          "[PopupCallback] window.opener is null (expected on iOS Safari)",
        );
      }

      // 3 - localStorage에 저장 (iOS Safari 폴백용)
      try {
        localStorage.setItem(
          OAUTH_STORAGE_KEY,
          JSON.stringify(oauthResult.payload),
        );
        console.log("[PopupCallback] Saved result to localStorage");
      } catch (error) {
        console.error("[PopupCallback] Failed to save to localStorage:", error);
      }

      // 팝업 닫기 (팝업이 스크립트로 열린 경우에만 정상 동작)
      if (!isPopupWindow) {
        const isSafeReturnUrl = (url) =>
          typeof url === "string" &&
          url.startsWith("/") &&
          !url.startsWith("//");

        const returnUrl = sessionStorage.getItem("returnUrl");
        const safeReturnUrl = isSafeReturnUrl(returnUrl);

        if (safeReturnUrl) {
          sessionStorage.removeItem("returnUrl");
          navigate(returnUrl, { replace: true });
        } else {
          navigate("/", { replace: true });
        }
        return;
      }

      try {
        window.close();
      } catch (error) {
        console.warn(
          "[PopupCallback] Unable to close window programmatically:",
          error,
        );
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  return (
    <Page>
      <Center>
        <Spinner aria-label="loading" />
        <Message>로그인 완료중 입니다...</Message>
      </Center>
    </Page>
  );
}

// styled components
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

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
  color: #000000;
`;
