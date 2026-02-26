import { useState, useEffect } from "react";
import { fetchNearbyBakeries } from "../../../lib/api/bakery";

export default function useMapBakeries(mapCenter) {
  const [bakeries, setBakeries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mapCenter) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    // x = 경도(lng), y = 위도(lat)
    fetchNearbyBakeries({ x: mapCenter.lng, y: mapCenter.lat })
      .then((data) => {
        if (!cancelled) {
          setBakeries(data ?? []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[useMapBakeries]", err);
          setBakeries([]);
          setError(err);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [mapCenter]);

  return { bakeries, isLoading, error };
}
