import { KRW } from "../models/product";
import { useRecentViewed } from "../hooks/useRecentViewed";

export default function RecentViewed() {
  const items = useRecentViewed();
  if (!items.length) return null;
  return (
    <section className="mt-12">
      <h3 className="text-lg font-semibold mb-4">최근에 본 제품</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((it) => (
          <a key={it.id} href={`/products/${it.id}`} className="min-w-[160px]">
            <div className="aspect-[3/4] overflow-hidden rounded border border-gray-200 bg-white">
              <img src={it.img} alt={it.name} className="h-full w-full object-cover" />
            </div>
            <p className="mt-2 text-sm text-gray-700 line-clamp-1">{it.name}</p>
            <p className="text-sm font-medium">{KRW(it.price)}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
