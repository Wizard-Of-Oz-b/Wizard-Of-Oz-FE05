import { useEffect, useState } from 'react';
import { KRW } from '../../../models/product';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductGridSkeleton } from '../layouts/admin/common/DashboardSkeleton';
import { useToasts } from '../layouts/reviews/hooks/useToasts';

const API_BASE =
  import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api/v1';

export default function RandomProducts({ limit = 6 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const { ToastHost, onToast } = useToasts(); // 에러처리를 위한 토스트 추가

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/v1/products/`);
        if (!res.ok) throw new Error('상품 목록 불러오기 실패');
        const data = await res.json();

        const products = data.results ?? [];
        const mapped = products.map((p) => ({
          id: p.product_id,
          name: p.name,
          price: Number(p.price ?? 0),
          img: p.primary_image?.url || p.images?.[0]?.url || '/no-image.png',
        }));

        const sliced = [...mapped]
          .sort(() => Math.random() - 0.5)
          .slice(0, limit);
        if (alive) setItems(sliced);
      } catch (err) {
        console.error(err);
        setFailed(true);
        onToast('error', '추천 상품을 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [limit]);

  if (loading) {
    return (
      <section className="mt-12">
        <h3 className="text-lg font-semibold mb-4">추천 상품</h3>
        <ProductGridSkeleton n={limit} />
      </section>
    );
  }

  if (failed && !items.length) {
    return (
      <section className="mt-12">
        <h3 className="text-lg font-semibold mb-4">추천 상품</h3>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
          <p className="text-gray-700">지금 추천 상품을 가져오지 못했어요.</p>
          <button
            type="button"
            onClick={fetchItems}
            className="mt-3 inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            다시 시도하기
          </button>
        </div>
        <ToastHost />
      </section>
    );
  }
  
  if (!items.length) return null;

  return (
    <section className="mt-12">
      <h3 className="text-lg font-semibold mb-4">추천 상품</h3>

      <Swiper
        modules={[Navigation, Pagination, A11y]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={12}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 12 },
          768: { slidesPerView: 3, spaceBetween: 16 },
          1024:{ slidesPerView: 4, spaceBetween: 18 },
          1280:{ slidesPerView: 5, spaceBetween: 20 },
        }}
        style={{ paddingBottom: 24 }} // 점(페이지네이션) 여백
      >
        {items.map((it) => (
          <SwiperSlide key={it.id}>
          <a href={`/products/${it.id}`} className="block w-full">
            <div className="aspect-[3/4] overflow-hidden rounded border border-gray-200 bg-white">
              <img
                src={it.img}
                alt={it.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-2 text-sm text-gray-700 line-clamp-1">{it.name}</p>
            <p className="text-sm font-medium">{KRW(it.price)}</p>
          </a>
        </SwiperSlide>
        ))}
      </Swiper>
      
      <ToastHost />

    </section>
  );
}
