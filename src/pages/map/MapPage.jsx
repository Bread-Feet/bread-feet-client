import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import PageLayout from "../../components/layout/PageLayout";
import { loadKakaoMaps } from "../../lib/kakao-map-loader";
import BakeryPreviewCard from "./components/BakeryPreviewCard";
import useMapBakeries from "./hooks/useMapBakeries";

const SEOUL_FALLBACK = { lat: 37.5665, lng: 126.978 };
const DEFAULT_ZOOM_LEVEL = 5;

const MAP_FRAME_STYLE = `
  padding: 0;
  overflow: hidden;
  height: calc(var(--app-100vh) - var(--tabbar-height));
  max-height: calc(var(--app-100vh) - var(--tabbar-height));
`;

function getCurrentLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(SEOUL_FALLBACK);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
      () => resolve(SEOUL_FALLBACK),
      { timeout: 6000, maximumAge: 60000 },
    );
  });
}

export default function MapPage() {
  const mapContainerRef = useRef(null);
  const kakaoMapRef = useRef(null);
  const markerMapRef = useRef(new Map());
  const [selectedBakery, setSelectedBakery] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const { bakeries, isLoading, error } = useMapBakeries();

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      await loadKakaoMaps();
      if (cancelled || !mapContainerRef.current) return;

      const { lat, lng } = await getCurrentLocation();
      if (cancelled || !mapContainerRef.current) return;

      const center = new window.kakao.maps.LatLng(lat, lng);
      const map = new window.kakao.maps.Map(mapContainerRef.current, {
        center,
        level: DEFAULT_ZOOM_LEVEL,
      });

      kakaoMapRef.current = map;

      window.kakao.maps.event.addListener(map, "click", () => {
        setSelectedBakery(null);
      });

      if (!cancelled) setMapReady(true);
    }

    initMap().catch((err) => console.error("[MapPage] init failed:", err));

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !kakaoMapRef.current) return;
    kakaoMapRef.current.relayout();
  }, [mapReady]);

  useEffect(() => {
    if (!mapReady || !kakaoMapRef.current) return;

    bakeries.forEach((bakery) => {
      if (markerMapRef.current.has(bakery.bakeryId)) return; // 이미 추가됨

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

  useEffect(() => {
    return () => {
      markerMapRef.current.forEach((m) => {
        m.setMap(null);
      });
      markerMapRef.current.clear();
    };
  }, []);

  return (
    <PageLayout frameStyle={MAP_FRAME_STYLE}>
      <MapWrapper>
        <MapContainer ref={mapContainerRef} />

        {isLoading && (
          <LoadingOverlay>
            <LoadingText>빵집을 불러오는 중...</LoadingText>
          </LoadingOverlay>
        )}

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
