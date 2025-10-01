import { useEffect } from "react";
import { MapPin, Phone, Clock } from "lucide-react";

export default function StoreIntro() {
  useEffect(() => {
  if (!window.naver) return;

  const map = new window.naver.maps.Map("map", {
    center: new window.naver.maps.LatLng(37.5045032, 127.0490041),
    zoom: 15,
  });

  // 첫 번째 매장 마커
  new window.naver.maps.Marker({
    position: new window.naver.maps.LatLng(37.5052194, 127.0657416),
    map,
    icon: {
      url: "images/fairy.png",
      size: new window.naver.maps.Size(40, 40),
      scaledSize: new window.naver.maps.Size(40, 40),
      origin: new window.naver.maps.Point(0, 0),
      anchor: new window.naver.maps.Point(20, 40),
    },
    title: "오즈의 이상한 상점 삼성점",
  });

  // 두 번째 매장 마커
  new window.naver.maps.Marker({
    position: new window.naver.maps.LatLng(37.5015994, 127.0377433),
    map,
    icon: {
      url: "images/fairy.png",
      size: new window.naver.maps.Size(40, 40),
      scaledSize: new window.naver.maps.Size(40, 40),
      origin: new window.naver.maps.Point(0, 0),
      anchor: new window.naver.maps.Point(20, 40),
    },
    title: "오즈의 이상한 상점 역삼점",
  });
}, []);


  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
      {/* 상단 타이틀 */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
          오즈의 이상한 상점 매장 소개
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-600">
          오프라인 매장에서 직접 만나는 특별한 경험 ✨
        </p>
      </div>

      {/* 지도 */}
      <div className="max-w-4xl mx-auto">
        <div
          id="map"
          className="w-full h-80 sm:h-[400px] rounded-2xl shadow-lg border border-neutral-200"
        />
      </div>

      {/* 매장 정보 카드 */}
      <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* 주소 */}
        <div className="flex items-start gap-3 rounded-xl bg-white p-5 shadow hover:shadow-md transition">
          <MapPin className="h-6 w-6 text-violet-600 mt-1" />
          <div>
            <h3 className="font-semibold text-neutral-900">매장 주소</h3>
            <p className="text-sm text-neutral-600 mt-1">
              서울특별시 중구 세종대로 110 (서울시청 옆)
            </p>
          </div>
        </div>

        {/* 연락처 */}
        <div className="flex items-start gap-3 rounded-xl bg-white p-5 shadow hover:shadow-md transition">
          <Phone className="h-6 w-6 text-violet-600 mt-1" />
          <div>
            <h3 className="font-semibold text-neutral-900">연락처</h3>
            <p className="text-sm text-neutral-600 mt-1">02-1234-5678</p>
          </div>
        </div>

        {/* 영업시간 */}
        <div className="flex items-start gap-3 rounded-xl bg-white p-5 shadow hover:shadow-md transition">
          <Clock className="h-6 w-6 text-violet-600 mt-1" />
          <div>
            <h3 className="font-semibold text-neutral-900">영업 시간</h3>
            <p className="text-sm text-neutral-600 mt-1">
              월~금: 10:00 ~ 20:00
              <br />
              토~일: 11:00 ~ 18:00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
