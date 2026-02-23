import { useCallback, useState } from "react";
import { fetchBakery, deleteBakery } from "../lib/api/bakery";

export default function useBakery(bakeryId) {
  const [bakery, setBakery] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    if (!bakeryId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchBakery(bakeryId);
      setBakery(data ?? null);
      return data;
    } catch (err) {
      console.error(err);
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
      setLoaded(true);
    }
  }, [bakeryId]);

  const remove = useCallback(async (id) => {
    const targetId = id ?? bakeryId;
    if (!targetId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await deleteBakery(targetId);
      return data;
    } catch (err) {
      console.error(err);
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
      setLoaded(true);
    }
  }, [bakeryId]);

  return { bakery, isLoading, error, load, loaded, remove };
}
