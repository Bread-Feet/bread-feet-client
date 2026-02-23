import { useState, useEffect, useRef, useCallback } from "react";
import { fetchMyBakeries } from "../../../lib/api/bakery";

const PAGE_SIZE = 10;

export default function useMyBakeries(keyword, sort) {
  const [bakeries, setBakeries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef(null);

  const load = useCallback(
    async (kw, cursor) => {
      setIsLoading(true);
      try {
        const data = await fetchMyBakeries({
          keyword: kw,
          cursor,
          size: PAGE_SIZE,
          sort,
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
    },
    [sort],
  );

  useEffect(() => {
    cursorRef.current = null;
    setHasMore(true);
    setBakeries([]);
    load(keyword, null);
  }, [keyword, sort, load]);

  const loadMore = () => {
    if (!isLoading && hasMore && cursorRef.current != null) {
      load(keyword, cursorRef.current);
    }
  };

  return { bakeries, isLoading, hasMore, loadMore };
}
