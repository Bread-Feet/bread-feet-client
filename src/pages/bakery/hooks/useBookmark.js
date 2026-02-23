import { useState, useEffect } from "react";
import { fetchBookmark, createBookmark, deleteBookmark } from "../../../lib/api/bookmark";
import { getValidAccessToken } from "../../../lib/token-storage";

export default function useBookmark(bakeryId) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!bakeryId) return;

    let cancelled = false;
    getValidAccessToken().then((token) => {
      if (!token || cancelled) return;
      fetchBookmark({ bakeryId })
        .then((data) => {
          if (!cancelled) setIsBookmarked(data === true);
        })
        .catch(() => {});
    });

    return () => {
      cancelled = true;
    };
  }, [bakeryId]);

  const toggle = async () => {
    if (isLoading) return;

    const token = await getValidAccessToken();
    if (!token) return;

    const next = !isBookmarked;
    setIsBookmarked(next);
    setIsLoading(true);
    try {
      if (next) {
        await createBookmark({ bakeryId });
      } else {
        await deleteBookmark({ bakeryId });
      }
    } catch {
      setIsBookmarked(!next);
    } finally {
      setIsLoading(false);
    }
  };

  return { isBookmarked, toggle, isLoading };
}
