import { useEffect, useState } from 'react';
import { KRW } from '../../../models/product';

const API_BASE =
  import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api/v1';

export default function RandomProducts({ limit = 6 }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
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
      }
    })();
    return () => {
      alive = false;
    };
  }, [limit]);

  if (!items.length) return null;

  return (
    <section className="mt-12">
      <h3 className="text-lg font-semibold mb-4">추천 상품</h3>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map((it) => (
          <a
            key={it.id}
            href={`/products/${it.id}`}
            className="w-[210px] sm:w-[250px] lg:w-[290px] flex-none"
          >
            <div className="aspect-[3/4] overflow-hidden rounded border border-gray-200 bg-white">
              <img
                src={it.img}
                alt={it.name}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-2 text-sm text-gray-700 line-clamp-1">{it.name}</p>
            <p className="text-sm font-medium">{KRW(it.price)}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
