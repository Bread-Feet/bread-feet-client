import { useState, useEffect, useRef, useCallback } from "react";
import { fetchMyBakeries } from "../../../lib/api/bakery";

const PAGE_SIZE = 10;

export default function useMyBakeries(keyword) {
  const [bakeries, setBakeries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef(0);

  const load = useCallback(async (kw, cursor) => {
    setIsLoading(true);
    try {
      const data = await fetchMyBakeries({ keyword: kw, cursorId: cursor, size: PAGE_SIZE });
      const content = data?.content ?? [];
      setBakeries((prev) => (cursor === 0 ? content : [...prev, ...content]));
      if (content.length < PAGE_SIZE) {
        setHasMore(false);
        cursorRef.current = null;
      } else {
        setHasMore(true);
        cursorRef.current = content[content.length - 1]?.cursorId ?? null;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cursorRef.current = 0;
    setHasMore(true);
    setBakeries([]);
    load(keyword, 0);
  }, [keyword, load]);

  const loadMore = () => {
    if (!isLoading && hasMore && cursorRef.current != null) {
      load(keyword, cursorRef.current);
    }
  };

  return { bakeries, isLoading, hasMore, loadMore };
}
