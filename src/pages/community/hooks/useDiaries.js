import { useState, useEffect, useRef, useCallback } from "react";
import { fetchDiaries } from "../../../lib/api/diary";

const PAGE_SIZE = 10;

export default function useDiaries() {
  const [diaries, setDiaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef(0);

  const load = useCallback(async (cursor) => {
    setIsLoading(true);
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
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cursorRef.current = 0;
    setHasMore(true);
    setDiaries([]);
    load(0);
  }, [load]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && cursorRef.current != 0) {
      load(cursorRef.current);
    }
  }, [isLoading, hasMore, load]);

  return { diaries, isLoading, hasMore, loadMore };
}
