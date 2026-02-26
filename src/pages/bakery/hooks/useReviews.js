import { useState, useEffect, useRef, useCallback } from "react";
import { fetchReviews } from "../../../lib/api/review";

const PAGE_SIZE = 10;

export default function useReviews(bakeryId) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef(null);

  const load = useCallback(
    async (cursor) => {
      if (!bakeryId) return;
      setIsLoading(true);
      try {
        const data = await fetchReviews({ bakeryId, cursor, size: PAGE_SIZE });
        const content = data?.content ?? [];
        setReviews((prev) => (cursor === null ? content : [...prev, ...content]));
        if (content.length < PAGE_SIZE) {
          setHasMore(false);
          cursorRef.current = null;
        } else {
          setHasMore(true);
          cursorRef.current = content[content.length - 1]?.cursorId ?? null;
        }
      } catch (err) {
        console.error(err);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [bakeryId],
  );

  useEffect(() => {
    cursorRef.current = null;
    setHasMore(true);
    setReviews([]);
    load(null);
  }, [bakeryId, load]);

  const loadMore = () => {
    if (!isLoading && hasMore && cursorRef.current != null) {
      load(cursorRef.current);
    }
  };

  const refresh = useCallback(() => {
    cursorRef.current = null;
    setHasMore(true);
    setReviews([]);
    load(null);
  }, [load]);

  return { reviews, isLoading, hasMore, loadMore, refresh };
}
