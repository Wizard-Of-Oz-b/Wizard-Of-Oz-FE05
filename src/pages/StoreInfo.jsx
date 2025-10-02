import { useEffect, useRef, useState } from "react";
import { MapPin, Phone, Clock } from "lucide-react";

const stores = [
  {
    id: "samsung",
    name: "오즈의 이상한 상점 삼성점",
    lat: 37.5052194,
    lng: 127.0657416,
    address: "서울특별시 강남구 삼성동 123-45",
    phone: "02-1111-2222",
    hours: "월~금 10:00~20:00, 토~일 11:00~18:00",
  },
  {
    id: "yeoksam",
    name: "오즈의 이상한 상점 역삼점",
    lat: 37.5015994,
    lng: 127.0377433,
    address: "서울특별시 강남구 역삼동 678-90",
    phone: "02-3333-4444",
    hours: "월~금 10:00~20:00, 토~일 11:00~18:00",
  },
];

export default function StoreIntro() {
  const [activeStore, setActiveStore] = useState(stores[0]);
  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const waitForNaverMaps = () =>
    new Promise((resolve, reject) => {
      if (window?.naver?.maps?.Map) return resolve(window.naver.maps);
      const start = Date.now();
      const timer = setInterval(() => {
        if (window?.naver?.maps?.Map) {
          clearInterval(timer);
          resolve(window.naver.maps);
        } else if (Date.now() - start > 3000) {
          clearInterval(timer);
          reject(new Error("Naver Maps script not ready"));
        }
      }, 50);
    });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const maps = await waitForNaverMaps();
        if (cancelled || !mapElRef.current) return;

        mapRef.current = new maps.Map(mapElRef.current, {
          center: new maps.LatLng(activeStore.lat, activeStore.lng),
          zoom: 17,
        });

        markerRef.current = new maps.Marker({
          position: new maps.LatLng(activeStore.lat, activeStore.lng),
          map: mapRef.current,
          icon: {
            url: "images/fairy.png",
            size: new maps.Size(40, 40),
            scaledSize: new maps.Size(40, 40),
            anchor: new maps.Point(20, 40),
          },
          title: activeStore.name,
        });
      } catch (e) {
        console.error("[NaverMaps] 초기화에 실패하였습니다.:", e);
      }
    })();

    return () => {
      cancelled = true;
      markerRef.current = null;
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const maps = window?.naver?.maps;
    if (!maps || !mapRef.current || !markerRef.current) return;

    const pos = new maps.LatLng(activeStore.lat, activeStore.lng);
    mapRef.current.setCenter(pos);
    markerRef.current.setPosition(pos);
    markerRef.current.setTitle?.(activeStore.name);
  }, [activeStore]);

return (
  <div className="min-h-screen bg-white">
    {/* ── HERO: 매장 감성 먼저 보여주기 ── */}
    <section className="relative">
      <div
        className="h-[320px] sm:h-[380px] w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/storehero.jpg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex items-end justify-between gap-3">
          <div className="text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] sm:text-xs border border-white/20 backdrop-blur">
              ✨ 오프라인 한정 체험 · 시그니처 라인
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
              오즈의 이상한 상점 오프라인 스토어
            </h1>
            <p className="mt-1 text-sm sm:text-base text-white/90">
              “사진보다 예쁜 디테일, 착용감은 직접 경험하세요.”
            </p>
          </div>

          {/* 길찾기 퀵 CTA */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => window.open(`https://map.naver.com/p/search/${encodeURIComponent(activeStore.address)}`, "_blank")}
              className="h-10 px-4 rounded-full bg-[#03c75a] text-white text-sm font-semibold shadow hover:opacity-95 transition cursor-pointer"
            >
              네이버맵 길찾기
            </button>
            <button
              onClick={() => window.open(`https://map.kakao.com/link/search/${encodeURIComponent(activeStore.address)}`, "_blank")}
              className="h-10 px-4 rounded-full bg-[#ffd900] text-black text-sm font-semibold shadow hover:opacity-95 transition cursor-pointer"
            >
              카카오맵 길찾기
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* ── 탭 & 프리뷰 썸네일 ── */}
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {stores.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveStore(s)}
            className={`group relative flex items-center gap-3 rounded-2xl border px-3.5 py-2 transition-all
              ${activeStore.id === s.id
                ? "border-transparent bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md"
                : "border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700"
              }`}
          >
            {/* 미니 썸네일 */}
            <span
              className={`h-7 w-7 rounded-full bg-center bg-cover border
                ${activeStore.id === s.id ? "border-white" : "border-neutral-200"}`}
              style={{
                backgroundImage: `url('/images/${s.id}-thumb.jpg')`
              }}
            />
            <span className="text-sm font-medium">
              {s.name.replace("오즈의 이상한 상점 ", "")}
            </span>
          </button>
        ))}
      </div>
    </section>

    {/* ── 지도 & 카드 섹션 ── */}
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-6">
      {/* 지도 */}
      <div className="rounded-2xl border border-neutral-200 shadow-lg overflow-hidden">
        <div
          ref={mapElRef}
          className="w-full h-[340px] sm:h-[420px]"
        />
      </div>

      {/* 정보 카드 & 방문 포인트 */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 매장 정보 카드 */}
        <div className="col-span-2 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 text-white flex items-center justify-center text-sm font-bold">
              OZ
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold tracking-tight text-neutral-900">
                  {activeStore.name}
                </h3>
                {/* 모바일 길찾기 퀵 CTA */}
                <div className="flex sm:hidden items-center gap-2">
                  <button
                    onClick={() => window.open(`https://map.naver.com/p/search/${encodeURIComponent(activeStore.address)}`, "_blank")}
                    className="h-9 px-3 rounded-full bg-[#03c75a] text-white text-xs font-semibold shadow cursor-pointer"
                  >
                    네이버맵
                  </button>
                  <button
                    onClick={() => window.open(`https://map.kakao.com/link/search/${encodeURIComponent(activeStore.address)}`, "_blank")}
                    className="h-9 px-3 rounded-full bg-[#381e1f] text-white text-xs font-semibold shadow cursor-pointer"
                  >
                    카카오맵
                  </button>
                </div>
              </div>

              {/* 주소/연락처/영업시간 */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-violet-600 mt-0.5" />
                  <div>
                    <div className="text-xs text-neutral-500">주소</div>
                    <div className="text-sm text-neutral-800">{activeStore.address}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-violet-600 mt-0.5" />
                  <div>
                    <div className="text-xs text-neutral-500">연락처</div>
                    <div className="text-sm text-neutral-800">{activeStore.phone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-violet-600 mt-0.5" />
                  <div>
                    <div className="text-xs text-neutral-500">영업시간</div>
                    <div className="text-sm text-neutral-800">{activeStore.hours}</div>
                  </div>
                </div>
              </div>

              {/* 편의시설 배지 */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-50 px-3 py-1 text-[11px] border border-neutral-200 text-neutral-700">🅿 주차 가능</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-50 px-3 py-1 text-[11px] border border-neutral-200 text-neutral-700">👗 피팅룸</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-50 px-3 py-1 text-[11px] border border-neutral-200 text-neutral-700">☕ 웰컴 드링크</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-50 px-3 py-1 text-[11px] border border-neutral-200 text-neutral-700">📦 매장 픽업</span>
              </div>
            </div>
          </div>

          {/* 방문 유도 CTA */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.open(`/lookbook?store=${activeStore.id}`, "_self")}
              className="flex-1 h-11 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-500 shadow hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition"
            >
              매장 전용 룩북 보기
            </button>
            <button
              onClick={() => window.open(`/reserve-fitting?store=${activeStore.id}`, "_self")}
              className="flex-1 h-11 rounded-full text-sm font-semibold border border-neutral-300 text-neutral-800 hover:bg-neutral-50 transition"
            >
              피팅 예약
            </button>
          </div>
        </div>

        {/* 방문 포인트 / 사진 프리뷰 */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h4 className="text-base font-bold text-neutral-900">여긴 꼭 방문해야 하는 이유</h4>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700">
            <li>• 온라인 미공개 컬러 & 한정 드롭 선공개</li>
            <li>• 체형별 추천 핏 상담 · 스타일링 팁</li>
            <li>• 오프라인 단독 프로모션 & 기프트</li>
          </ul>

          {/* 미니 갤러리 */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="aspect-[4/3] rounded-lg bg-neutral-100 bg-center bg-cover" style={{ backgroundImage: "url('/images/store-a.jpg')" }} />
            <div className="aspect-[4/3] rounded-lg bg-neutral-100 bg-center bg-cover" style={{ backgroundImage: "url('/images/store-b.jpg')" }} />
            <div className="aspect-[4/3] rounded-lg bg-neutral-100 bg-center bg-cover" style={{ backgroundImage: "url('/images/store-c.jpg')" }} />
          </div>
        </div>
      </div>
    </section>

    {/* ── 하단 배너(옵션): 방문 혜택 강조 ── */}
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-2xl border border-neutral-200 bg-gradient-to-r from-neutral-50 to-white p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">In–store Only</p>
          <h5 className="text-lg sm:text-xl font-extrabold tracking-tight text-neutral-900">
            방문 고객 웰컴 기프트 · 첫구매 10% 쿠폰
          </h5>
          <p className="text-sm text-neutral-600 mt-1">*재고 소진 시 조기 종료될 수 있습니다.</p>
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="h-11 px-6 rounded-full text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 transition shadow"
        >
          매장 위치 다시 보기
        </button>
      </div>
    </section>
  </div>
);
}