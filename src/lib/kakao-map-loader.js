const KAKAO_MAPS_APP_KEY = import.meta.env.VITE_KAKAO_JS_KEY;

let loadPromise = null;

export function loadKakaoMaps() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new Error("Kakao Maps can only load in browser"));
  }

  if (window.kakao?.maps?.Map) {
    return Promise.resolve();
  }

  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-kakao-maps]");

    if (existing) {
      const status = existing.getAttribute("data-status");
      if (status === "loaded") {
        window.kakao.maps.load(() => resolve());
        return;
      }
      if (status === "error") {
        existing.remove();
        loadPromise = null;
        reject(new Error("Failed to load Kakao Maps SDK"));
        return;
      }
      existing.addEventListener(
        "load",
        () => {
          existing.setAttribute("data-status", "loaded");
          window.kakao.maps.load(() => resolve());
        },
        { once: true },
      );
      existing.addEventListener(
        "error",
        () => {
          existing.setAttribute("data-status", "error");
          loadPromise = null;
          reject(new Error("Failed to load Kakao Maps SDK"));
        },
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAPS_APP_KEY}&libraries=services,clusterer&autoload=false`;
    script.async = true;
    script.setAttribute("data-kakao-maps", "true");
    script.setAttribute("data-status", "loading");

    script.onload = () => {
      script.setAttribute("data-status", "loaded");
      window.kakao.maps.load(() => resolve());
    };
    script.onerror = () => {
      script.setAttribute("data-status", "error");
      loadPromise = null;
      reject(new Error("Failed to load Kakao Maps SDK"));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
}
