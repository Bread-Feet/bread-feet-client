import styled, { keyframes } from "styled-components";

import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { useEffect } from "react";
import { markLoginSuccess } from "../../lib/api-client";
import { apiClient } from "../../lib/api-client";
import { getApiUrl } from "../../config/env";

export default function LoginSuccessPage() {
  const navigate = useNavigate();
  const { setUser, setLoading } = useUserStore();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);

        console.log("Fetching user info from:", getApiUrl());
        const userData = await apiClient.get("/api/v1/members/me");

        setUser({
          id: userData.id,
          nickname: userData.nickname,
          age: userData.age,
          email: userData.email,
        });

        markLoginSuccess();

        const isSafeReturnUrl = (url) =>
          typeof url === "string" &&
          url.startsWith("/") &&
          !url.startsWith("//");

        const returnUrl = sessionStorage.getItem("returnUrl");
        const safeReturnUrl = isSafeReturnUrl(returnUrl);
        if (safeReturnUrl) {
          sessionStorage.removeItem("returnUrl");
          navigate(safeReturnUrl, { replace: true }); // 로그인 페이지 오기 이전 페이지로 이동
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
  min-height: 100vh;
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
