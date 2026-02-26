import { useState, useEffect, useRef, useCallback } from "react";
import { fetchDiaries } from "../../../lib/api/diary";

const PAGE_SIZE = 10;

export default function useDiaries() {
  const [diaries, setDiaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const cursorRef = useRef(0);
  const lastRequestedCursorRef = useRef(0);

  const load = useCallback(async (cursor) => {
    lastRequestedCursorRef.current = cursor;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchDiaries({ cursor, size: PAGE_SIZE });
      const content = data?.content ?? [];
      const sliceInfo = data?.sliceInfo;

      setDiaries((prev) => (cursor === 0 ? content : [...prev, ...content]));

      if (sliceInfo?.last) {
        setHasMore(false);
        cursorRef.current = 0;
      } else {
        setHasMore(true);
        cursorRef.current =
          sliceInfo?.cursor ?? content[content.length - 1]?.cursorId ?? null;
      }
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cursorRef.current = 0;
    lastRequestedCursorRef.current = 0;
    setHasMore(true);
    setError(null);
    setDiaries([]);
    load(0);
  }, [load]);

  const loadMore = useCallback(() => {
    if (
      !isLoading &&
      hasMore &&
      cursorRef.current !== null &&
      cursorRef.current !== 0
    ) {
      load(cursorRef.current);
    }
  }, [isLoading, hasMore, load]);

  const retry = useCallback(() => {
    if (isLoading) return;
    load(lastRequestedCursorRef.current ?? 0);
  }, [isLoading, load]);

  return { diaries, isLoading, hasMore, loadMore, error, retry };
}
