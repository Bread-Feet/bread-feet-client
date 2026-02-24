import { useState, useEffect } from "react";
import { fetchAllMapBakeries } from "../../../lib/api/bakery";
import { loadKakaoMaps } from "../../../lib/kakao-map-loader";
import { geocodeAddress } from "../../../lib/kakao-geocoder";

const GEOCODE_DELAY_MS = 150;

function resolveAddress(bakery) {
  return (
    bakery.address?.roadAddress ||
    bakery.roadAddress ||
    bakery.address?.lotNumber ||
    bakery.lotNumber ||
    null
  );
}

export default function useMapBakeries() {
  const [bakeries, setBakeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      await loadKakaoMaps();
      if (cancelled) return;

      const data = await fetchAllMapBakeries();
      if (cancelled) return;

      const withCoords = [];
      const needsGeocoding = [];

      data.forEach((b) => {
        if (b.xCoordinate != null && b.yCoordinate != null) {
          withCoords.push(b);
        } else {
          const addr = resolveAddress(b);
          if (addr) needsGeocoding.push({ bakery: b, addr });
        }
      });

      if (!cancelled) {
        setBakeries(withCoords);
        setIsLoading(false);
      }

      const addrGroups = new Map();
      needsGeocoding.forEach(({ bakery, addr }) => {
        if (!addrGroups.has(addr)) addrGroups.set(addr, []);
        addrGroups.get(addr).push(bakery);
      });

      const geocoded = [];
      for (const [addr, group] of addrGroups) {
        if (cancelled) break;

        try {
          const coords = await geocodeAddress(addr);
          if (coords) {
            group.forEach((bakery) => {
              geocoded.push({
                ...bakery,
                xCoordinate: coords.x,
                yCoordinate: coords.y,
              });
            });
          }
        } catch (e) {
          console.warn(`[useMapBakeries] geocode failed for "${addr}"`, e);
        }

        await new Promise((r) => setTimeout(r, GEOCODE_DELAY_MS));
      }

      if (!cancelled && geocoded.length > 0) {
        setBakeries((prev) => [...prev, ...geocoded]);
      }
    }

    load().catch((err) => {
      if (!cancelled) {
        setError(err);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { bakeries, isLoading, error };
}
