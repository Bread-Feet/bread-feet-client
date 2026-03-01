import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import PageLayout from "../../components/layout/PageLayout";
import { fetchRegionalRecommendations } from "../../lib/api/bakery";
import { loadKakaoMaps } from "../../lib/kakao-map-loader";
import BakeryPreviewCard from "./components/BakeryPreviewCard";
import useMapBakeries from "./hooks/useMapBakeries";

const KYUNGPOOK_FALLBACK = { lat: 35.887720188, lng: 128.607715777 };
const DEFAULT_ZOOM_LEVEL = 5;
const BOUNDS_DEBOUNCE_MS = 600;
const REGIONAL_SIZE = 2;
const REGIONS = ["서울", "대구", "대전", "부산", "충북"];
const REGION_CENTERS = {
  서울: { lat: 37.5665, lng: 126.978 },
  대구: { lat: 35.8714, lng: 128.6014 },
  대전: { lat: 36.3504, lng: 127.3845 },
  부산: { lat: 35.1796, lng: 129.0756 },
  충북: { lat: 36.6357, lng: 127.4917 },
};

function getUserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(KYUNGPOOK_FALLBACK);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
      () => resolve(KYUNGPOOK_FALLBACK),
      { timeout: 6000, maximumAge: 60000 },
    );
  });
}

export default function MapPage() {
  const mapContainerRef = useRef(null);
  const regionTabsRef = useRef(null);
  const kakaoMapRef = useRef(null);
  const markerMapRef = useRef(new Map());
  const regionalRequestRef = useRef(0);
  const skipBoundsRef = useRef(true);
  const suppressNextBoundsRef = useRef(false);

  const [selectedBakery, setSelectedBakery] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regionalBakeries, setRegionalBakeries] = useState(null);
  const [regionalLoading, setRegionalLoading] = useState(false);
  const [regionalError, setRegionalError] = useState(null);

  const { bakeries, error } = useMapBakeries(mapCenter);
  const displayBakeries = regionalBakeries ?? bakeries;
  const isRegionalMode = selectedRegion !== null;
  const nearbyError = isRegionalMode ? null : error;
  const clearRegionalMode = () => {
    regionalRequestRef.current += 1;
    setSelectedRegion(null);
    setRegionalBakeries(null);
    setRegionalError(null);
    setRegionalLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    let debounceTimer = null;

    async function initMap() {
      await loadKakaoMaps();
      if (cancelled || !mapContainerRef.current) return;

      const { lat, lng } = await getUserLocation();
      if (cancelled || !mapContainerRef.current) return;

      setMapCenter({ lat, lng });

      const center = new window.kakao.maps.LatLng(lat, lng);
      const map = new window.kakao.maps.Map(mapContainerRef.current, {
        center,
        level: DEFAULT_ZOOM_LEVEL,
      });

      kakaoMapRef.current = map;

      window.kakao.maps.event.addListener(map, "bounds_changed", () => {
        if (skipBoundsRef.current) {
          skipBoundsRef.current = false;
          return;
        }
        if (suppressNextBoundsRef.current) {
          suppressNextBoundsRef.current = false;
          return;
        }

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          if (cancelled) return;
          const c = map.getCenter();
          clearRegionalMode();
          setMapCenter({ lat: c.getLat(), lng: c.getLng() });
        }, BOUNDS_DEBOUNCE_MS);
      });

      window.kakao.maps.event.addListener(map, "click", () => {
        setSelectedBakery(null);
      });

      if (!cancelled) setMapReady(true);
    }

    initMap().catch((err) => {
      if (!cancelled) console.error("[MapPage] init failed:", err);
    });

    return () => {
      cancelled = true;
      clearTimeout(debounceTimer);
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !kakaoMapRef.current) return;
    kakaoMapRef.current.relayout();
  }, [mapReady]);

  useEffect(() => {
    if (!mapReady || !kakaoMapRef.current) return;

    markerMapRef.current.forEach((m) => {
      m.setMap(null);
    });
    markerMapRef.current.clear();
    setSelectedBakery(null);

    displayBakeries.forEach((bakery) => {
      const position = new window.kakao.maps.LatLng(
        bakery.yCoordinate,
        bakery.xCoordinate,
      );
      const marker = new window.kakao.maps.Marker({ position });
      marker.setMap(kakaoMapRef.current);

      window.kakao.maps.event.addListener(marker, "click", () => {
        setSelectedBakery(bakery);
      });

      markerMapRef.current.set(bakery.bakeryId, marker);
    });
  }, [mapReady, displayBakeries]);

  useEffect(() => {
    return () => {
      regionalRequestRef.current += 1;
      markerMapRef.current.forEach((m) => m.setMap(null));
      markerMapRef.current.clear();
    };
  }, []);

  const handleRegionClick = async (region) => {
    if (!mapReady || !kakaoMapRef.current) return;

    const requestId = regionalRequestRef.current + 1;
    regionalRequestRef.current = requestId;
    setSelectedRegion(region);
    setRegionalLoading(true);
    setRegionalError(null);
    setSelectedBakery(null);

    try {
      const data = await fetchRegionalRecommendations(region, REGIONAL_SIZE);
      if (requestId !== regionalRequestRef.current) return;
      const list = Array.isArray(data) ? data : [];
      setRegionalBakeries(list);

      const target =
        list.length > 0
          ? { lat: list[0].yCoordinate, lng: list[0].xCoordinate }
          : REGION_CENTERS[region];

      if (target) {
        suppressNextBoundsRef.current = true;
        kakaoMapRef.current.panTo(
          new window.kakao.maps.LatLng(target.lat, target.lng),
        );
      }
    } catch (err) {
      if (requestId !== regionalRequestRef.current) return;
      console.error("[MapPage] regional recommendations failed:", err);
      setRegionalBakeries([]);
      setRegionalError(err);
    } finally {
      if (requestId === regionalRequestRef.current) {
        setRegionalLoading(false);
      }
    }
  };

  const scrollRegionTabs = (direction) => {
    const node = regionTabsRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * 180, behavior: "smooth" });
  };

  return (
    <PageLayout>
      <MapWrapper>
        <MapContainer ref={mapContainerRef} />

        <RegionTabsWrap>
          <ScrollArrow
            type="button"
            aria-label="왼쪽으로 지역 탭 이동"
            onClick={() => scrollRegionTabs(-1)}
          >
            {"<"}
          </ScrollArrow>
          <RegionTabs ref={regionTabsRef}>
            {REGIONS.map((region) => (
              <RegionTabButton
                key={region}
                type="button"
                $active={selectedRegion === region}
                onClick={() => handleRegionClick(region)}
              >
                {region}
              </RegionTabButton>
            ))}
          </RegionTabs>
          <ScrollArrow
            type="button"
            aria-label="오른쪽으로 지역 탭 이동"
            onClick={() => scrollRegionTabs(1)}
          >
            {">"}
          </ScrollArrow>
        </RegionTabsWrap>

        {(nearbyError || regionalError) && (
          <LoadingOverlay>
            <LoadingText>빵집 정보를 불러오지 못했어요.</LoadingText>
          </LoadingOverlay>
        )}

        {regionalLoading && (
          <LoadingOverlay>
            <LoadingText>지역 추천을 불러오는 중이에요.</LoadingText>
          </LoadingOverlay>
        )}

        {selectedBakery && (
          <BakeryPreviewCard
            bakery={selectedBakery}
            onClose={() => setSelectedBakery(null)}
          />
        )}
      </MapWrapper>
    </PageLayout>
  );
}

const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const RegionTabsWrap = styled.div`
  position: absolute;
  top: 40px;
  left: 12px;
  right: 12px;
  z-index: 7;

  display: flex;
  align-items: center;
  gap: 8px;
`;

const RegionTabs = styled.div`
  flex: 1;
  display: flex;
  gap: 8px;
  overflow-x: auto;

  padding: 2px;

  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const RegionTabButton = styled.button`
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => (p.$active ? "var(--main-color4)" : "var(--main-color2)")};

  border: 0;
  flex: 0 0 auto;
  border-radius: 9999px;
  background: ${(p) =>
    p.$active ? "var(--main-color2)" : "var(--main-color4)"};

  padding: 5px 20px;

  cursor: pointer;
`;

const ScrollArrow = styled.button`
  font-size: 18px;
  color: #000000;

  width: 32px;
  height: 32px;

  display: none;
  border: 0;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.5);

  cursor: pointer;

  @media (hover: hover) and (pointer: fine) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

const MapContainer = styled.div`
  position: absolute;
  inset: 0;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.75);
  z-index: 5;
  pointer-events: none;
`;

const LoadingText = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;
