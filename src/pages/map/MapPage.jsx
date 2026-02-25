import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import PageLayout from "../../components/layout/PageLayout";
import { loadKakaoMaps } from "../../lib/kakao-map-loader";
import BakeryPreviewCard from "./components/BakeryPreviewCard";
import useMapBakeries from "./hooks/useMapBakeries";

const KYUNGPOOK_FALLBACK = { lat: 35.887720188, lng: 128.607715777 };
const DEFAULT_ZOOM_LEVEL = 5;
const BOUNDS_DEBOUNCE_MS = 400;

const MAP_FRAME_STYLE = `
  padding: 0;
  overflow: hidden;
  height: calc(var(--app-100vh) - var(--tabbar-height));
  max-height: calc(var(--app-100vh) - var(--tabbar-height));
`;

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
  const kakaoMapRef = useRef(null);
  const markerMapRef = useRef(new Map());
  const skipBoundsRef = useRef(true); // 지도 생성 직후 첫 bounds_changed 스킵
  const [selectedBakery, setSelectedBakery] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);

  const { bakeries, isLoading, error } = useMapBakeries(mapCenter);

  // 지도 초기화 + geolocation + bounds_changed 리스너 (최초 1회)
  useEffect(() => {
    let cancelled = false;
    let debounceTimer = null;

    async function initMap() {
      await loadKakaoMaps();
      if (cancelled || !mapContainerRef.current) return;

      const { lat, lng } = await getUserLocation();
      if (cancelled || !mapContainerRef.current) return;

      // 초기 중심 설정 → useMapBakeries 첫 API 호출 트리거
      setMapCenter({ lat, lng });

      const center = new window.kakao.maps.LatLng(lat, lng);
      const map = new window.kakao.maps.Map(mapContainerRef.current, {
        center,
        level: DEFAULT_ZOOM_LEVEL,
      });

      kakaoMapRef.current = map;

      // 지도 생성 시 자동 발생하는 첫 bounds_changed는 스킵
      window.kakao.maps.event.addListener(map, "bounds_changed", () => {
        if (skipBoundsRef.current) {
          skipBoundsRef.current = false;
          return;
        }
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          if (cancelled) return;
          const c = map.getCenter();
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

  // bakeries 교체 시 마커 전부 제거 후 새로 추가
  useEffect(() => {
    if (!mapReady || !kakaoMapRef.current) return;

    markerMapRef.current.forEach((m) => m.setMap(null));
    markerMapRef.current.clear();
    setSelectedBakery(null);

    bakeries.forEach((bakery) => {
      // x = 경도(lng), y = 위도(lat)
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
  }, [mapReady, bakeries]);

  // 언마운트 시 마커 정리
  useEffect(() => {
    return () => {
      markerMapRef.current.forEach((m) => m.setMap(null));
      markerMapRef.current.clear();
    };
  }, []);

  return (
    <PageLayout frameStyle={MAP_FRAME_STYLE}>
      <MapWrapper>
        <MapContainer ref={mapContainerRef} />

        {error && (
          <LoadingOverlay>
            <LoadingText>빵집 정보를 불러오지 못했습니다.</LoadingText>
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
