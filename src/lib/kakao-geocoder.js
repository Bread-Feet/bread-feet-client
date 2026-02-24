// 주소 → 좌표 캐시 (모듈 레벨: 페이지 이탈 후 복귀해도 재호출 없음)
const cache = new Map();

/**
 * Kakao Maps Geocoder를 Promise로 래핑
 * @param {string} address - 도로명 주소 or 지번 주소
 * @returns {Promise<{x: number, y: number} | null>}
 *   x = 경도(longitude), y = 위도(latitude) / 실패 시 null
 */
export function geocodeAddress(address) {
  if (cache.has(address)) {
    return Promise.resolve(cache.get(address));
  }

  return new Promise((resolve) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      const coords =
        status === window.kakao.maps.services.Status.OK && result.length > 0
          ? { x: parseFloat(result[0].x), y: parseFloat(result[0].y) }
          : null;
      cache.set(address, coords);
      resolve(coords);
    });
  });
}
