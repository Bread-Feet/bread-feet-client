import { getApiUrl } from "../config/env";

export const OAUTH_STORAGE_KEY = "bread_feet_oauth_result";
const OAUTH_CHANNEL_NAME = "bread_feet_oauth";

// pwa가 standalone 모드로 실행되는지 판별
export function isPWAStandalone() {
  if (typeof window === "undefined") return false; // 브라우저가 아님(window가 없음)
  return (
    // pwa가 standalone 모드로 실행 중
    window.matchMedia("(display-mode: standalone)").matches || // 안드로이드, 데스크톱 등
    window.navigator.standalone === true // ios safari
  );
}

// 성공 case
// 1. BroadcastChannel로 수신
// 2. postMessage로 수신
// 3. popup이 닫혔지만, localStorage에 결과 존재

// 실패 case
// 1. popup 차단
// 2. popup이 닫혔고, localStorage에 결과 없음
// 3. 5분 동안 login 완료 신호가 없음
export function openOAuthPopup(provider) {
  return new Promise((resolve, reject) => {
    const apiUrl = getApiUrl();

    // popup 크기 & 위치
    const width = 500;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    // 이전 OAuth 결과 제거
    localStorage.removeItem(OAUTH_STORAGE_KEY);

    // popup open
    const popup = window.open(
      `${apiUrl}/oauth/${provider}/login?mode=popup`, // url
      `breadfeetOAuth`, // popup name
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`, // popup option
    );

    // popup 실패
    if (!popup) {
      console.warn("팝업이 차단되어 있습니다.");
      reject(new Error("Popup blocked"));
      return;
    }

    // login 결과 받기 start
    // 1, 2 중 먼저 오는걸로 성공 처리 + 정리
    // 1 - BroadcastChannel
    // BroadcastChannel : 동일 도메인(origin) 내의 여러 탭/창 등이 메시지를 주고 받는 api
    //                    일부 환경에서 지원이 제한됨
    let channel = null;

    try {
      channel = new BroadcastChannel(OAUTH_CHANNEL_NAME);

      // onmessage : 메시지가 도착하면 실행되는 함수
      // postMessage : 메시지 전송 함수
      channel.onmessage = (event) => {
        if (event.data && event.data.type == "OAUTH_COMPLETE") {
          console.log("[OAuth] Received result via BroadcastChannel");
          cleanup();
          resolve(event.data.payload);
        }
      };
    } catch (error) {
      console.log(
        "[OAuth] BroadcastChannel not supported, using localStorage fallback",
        error,
      );
    }

    // 2 - postMessage (window.opener가 살아있을 때. 즉 popup이 안닫힌 경우)
    const messageHandler = (event) => {
      // 보안
      if (event.origin !== window.location.origin) return; // 다른 도메인에서 보낸 메시지는 차단
      if (event.source !== popup) return; // 현재 popup에서 온 메시지만 받기

      if (event.data && event.data.type == "OAUTH_COMPLETE") {
        console.log("[OAuth] Received result via postMessage");
        cleanup();
        resolve(event.data.payload);
      }
    };

    // 3 - 팝업 닫힘 감지 + localStorage 폴백 (iOS Safari 대비)
    const pollTimer = setInterval(() => {
      if (popup.closed) {
        // 팝업 닫혔을 때 localStorage에서 결과 확인 (iOS safari 풀백)
        const storedResult = localStorage.getItem(OAUTH_STORAGE_KEY);

        // localStorage에 결과가 저장되어 있으면
        if (storedResult) {
          try {
            // JSON 파싱 시도
            const result = JSON.parse(storedResult);
            console.log("[OAuth] Received result via localStorage fallback");
            localStorage.removeItem(OAUTH_STORAGE_KEY);
            cleanup();
            resolve(result);
            return;
          } catch (error) {
            // JSON 파싱 시도 실패
            console.error("[OAuth] Failed to parse stored result:", error);
          }
        }

        // 사용자가 그냥 popup을 닫았다고 보고 login 취소 처리
        cleanup();
        reject(new Error("Login cancelled"));
      }
    }, 500); // 0.5초 마다 팝업 닫혔는지 확인
    // login 결과 받기 end

    // 5분 timer
    // login을 안하고 방치하거나, 오류로 login 완료 신호가 안오면 영원히 대기하는 상황 방지
    const timeoutTimer = setTimeout(
      () => {
        cleanup();

        // popup 열려있으면 닫기
        if (!popup.closed) {
          popup.close();
        }

        reject(new Error("Login timeout"));
      },
      5 * 60 * 1000,
    );

    // 정리 함수
    const cleanup = () => {
      window.removeEventListener("message", messageHandler);
      clearInterval(pollTimer);
      clearTimeout(timeoutTimer);

      if (channel) {
        channel.close();
      }

      localStorage.removeItem(OAUTH_STORAGE_KEY);
    };

    window.addEventListener("message", messageHandler);
  });
}
