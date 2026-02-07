const POSTCODE_SRC =
  "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

let loadPromise = null;

function loadDaumPostcodeScript() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(
      new Error("Postcode script can only load in browser"),
    );
  }

  const Postcode =
    (window.daum && window.daum.Postcode) ||
    (window.kakao && window.kakao.Postcode);

  if (Postcode) {
    return Promise.resolve();
  }
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-daum-postcode]");

    if (existing) {
      const status = existing.getAttribute("data-status");
      if (status === "loaded") return resolve();
      if (status === "error") {
        existing.remove();
        loadPromise = null;
        return reject(new Error("Failed to load Daum Postcode script"));
      }

      existing.addEventListener(
        "load",
        () => {
          existing.setAttribute("data-status", "loaded");
          resolve();
        },
        { once: true },
      );

      existing.addEventListener(
        "error",
        () => {
          existing.setAttribute("data-status", "error");
          loadPromise = null;
          reject(new Error("Failed to load Daum Postcode script"));
        },
        { once: true },
      );

      return;
    }

    const script = document.createElement("script");
    script.src = POSTCODE_SRC;
    script.async = true;
    script.setAttribute("data-daum-postcode", "true");
    script.setAttribute("data-status", "loading");

    script.onload = () => {
      script.setAttribute("data-status", "loaded");
      resolve();
    };
    script.onerror = () => {
      script.setAttribute("data-status", "error");
      loadPromise = null;
      reject(new Error("Failed to load Daum Postcode script"));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
}

export async function openDaumPostcode(options = {}) {
  await loadDaumPostcodeScript();

  const Postcode =
    (window.daum && window.daum.Postcode) ||
    (window.kakao && window.kakao.Postcode);

  if (!Postcode) {
    throw new Error("Daum Postcode is not available on window");
  }

  return new Promise((resolve, reject) => {
    new Postcode({
      ...options,
      oncomplete: resolve,
      onclose: (state) => reject(new Error("Postcode closed: " + state)),
    }).open();
  });
}
