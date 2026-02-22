import { useState, useEffect, useRef, useCallback } from "react";
import { fetchBakeries } from "../../../lib/api/bakery";

const PAGE_SIZE = 5;

export default function useBakeries(keyword) {
  const [bakeries, setBakeries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef(null); // cursor=0 에러 대응

  const load = useCallback(async (kw, cursor) => {
    setIsLoading(true);
    try {
      const data = await fetchBakeries({
        keyword: kw,
        cursor,
        size: PAGE_SIZE,
      });
      const content = data?.content ?? [];
      setBakeries((prev) =>
        cursor === null ? content : [...prev, ...content],
      );
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
  }, []);

  useEffect(() => {
    cursorRef.current = 0;
    setHasMore(true);
    setBakeries([]);
    load(keyword, null);
  }, [keyword, load]);

  const loadMore = () => {
    if (!isLoading && hasMore && cursorRef.current != null) {
      load(keyword, cursorRef.current);
    }
  };

  return { bakeries, isLoading, hasMore, loadMore };
}
