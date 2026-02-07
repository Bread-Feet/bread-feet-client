const DB_NAME = "breadfeet_auth";
const DB_VERSION = 1;
const STORE_NAME = "tokens";
const TOKEN_KEY = "auth_tokens";

// IndexedDB 지원 여부(사용 가능 여부)
export function isIndexedDBSupported() {
  return typeof window !== "undefined" && "indexedDB" in window;
}

// IndexedDB 열기
// DB가 없으면 생성
// STORE가 없으면 생성
function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBSupported()) {
      reject(new Error("IndexedDB not supported"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // STORE_NAME이 없으면 생성
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

// token 저장
// export async function saveTokens(accessToken, refreshToken) {
export async function saveTokens(accessToken) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const tokens = {
      accessToken,
      // refreshToken,
      savedAt: Date.now(),
    };

    store.put(tokens, TOKEN_KEY);

    // 트랜잭션 단위로 성공/실패를 확정
    tx.oncomplete = () => {
      db.close();
      resolve();
    };

    tx.onerror = () => {
      db.close();
      reject(tx.error || new Error("Failed to save tokens"));
    };

    tx.onabort = () => {
      db.close();
      reject(tx.error || new Error("Transaction aborted"));
    };
  });
}

// token 조회
export async function getTokens() {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(TOKEN_KEY);

    request.onsuccess = () => {
      db.close();
      resolve(request.result || null);
    };

    request.onerror = () => {
      db.close();
      reject(request.error || new Error("Failed to read tokens"));
    };

    tx.onabort = () => {
      db.close();
      reject(tx.error || new Error("Transaction aborted"));
    };
  });
}

export async function getAccessToken() {
  try {
    const tokens = await getTokens();
    return tokens?.accessToken || null;
  } catch {
    return null;
  }
}
