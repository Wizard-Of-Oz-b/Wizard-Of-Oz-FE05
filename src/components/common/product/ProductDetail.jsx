import { useEffect, useMemo, useState } from "react";
import { Heart, ShoppingCart, ChevronDown } from "lucide-react";
import { KRW, LS_RECENT } from "../../../models/product";
import RatingStars from "./RatingStars";
import ColorSwatches from "./ColorSwatches";
import SizeSelector from "./SizeSelector";
import QtyInput from "./QtyInput";
import ProductGallery from "./ProductGallery";
import LightboxModal from "./LightboxModal";

export default function ProductDetail({ product, onAddToCart }) {
  const [color, setColor] = useState(product.colors?.[0]?.code);
  const [size, setSize] = useState(product.sizes?.[0] || "M");
  const [qty, setQty] = useState(1);
  const [wish, setWish] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (i) => { setLightboxIndex(i); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const prevLightbox = () => setLightboxIndex((i) => (i - 1 + product.gallery.length) % product.gallery.length);
  const nextLightbox = () => setLightboxIndex((i) => (i + 1) % product.gallery.length);
  const jumpLightbox = (i) => setLightboxIndex(i);

  useEffect(() => {
    // 최근 본 상품
    try {
      const raw = localStorage.getItem(LS_RECENT);
      const arr = raw ? JSON.parse(raw) : [];
      const item = { id: product.id, name: product.name, img: product.gallery?.[0], price: product.price };
      const next = [item, ...arr.filter((x) => x.id !== item.id)].slice(0, 12);
      localStorage.setItem(LS_RECENT, JSON.stringify(next));
    } catch {}
  }, [product]);

  const price = useMemo(() => KRW(product.price), [product.price]);

  return (
    <>
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* 좌: 갤러리 */}
      <div className="lg:col-span-8">
        <ProductGallery images={product.gallery} onOpenLightbox={openLightbox} />
      </div>

      {/* 우: 구매패널 */}
      <aside className="lg:col-span-4">
        <div className="lg:sticky lg:top-16">
          <p className="text-xs tracking-wider text-gray-500">{product.brand}</p>
          <h1 className="mt-1 text-2xl font-semibold leading-snug">{product.name}</h1>

          <div className="mt-1">
            <RatingStars rating={product.rating} count={product.ratingCount} />
          </div>

          <div className="mt-3 text-[28px] font-medium">{price}</div>

          {/* 색상 */}
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">색상</p>
              <p className="text-xs text-gray-500">상품번호: {product.id}</p>
            </div>
            <ColorSwatches colors={product.colors} value={color} onChange={setColor} />
            <p className="mt-2 text-xs text-gray-600">
              {product.colors?.find((c) => c.code === color)?.name}
            </p>
          </div>

          {/* 사이즈 */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">사이즈</p>
              <button className="flex items-center gap-1 text-xs text-gray-600">
                사이즈 가이드 <ChevronDown size={14} />
              </button>
            </div>
            <SizeSelector sizes={product.sizes} value={size} onChange={setSize} />
          </div>

          {/* 수량 + 액션 */}
          <div className="mt-5 flex gap-3">
            <QtyInput value={qty} onChange={setQty} />
            <button
              onClick={() => onAddToCart?.({ product, color, size, qty })}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded bg-black px-4 py-3 text-white hover:bg-gray-900"
            >
              <ShoppingCart size={18} />
              장바구니 담기
            </button>
            <button
              onClick={() => setWish((w) => !w)}
              className={`rounded border px-3 ${wish ? "border-rose-500 text-rose-500" : "border-gray-300 text-gray-700"}`}
              title="위시리스트"
            >
              <Heart className={wish ? "fill-rose-500" : ""} />
            </button>
          </div>

          <ul className="mt-3 text-sm text-gray-600 space-y-1">
            <li>5만원 이상 무료 배송</li>
            <li>일부 품목 무료 반품</li>
          </ul>
        </div>
      </aside>
    </section>

    {/* 라이트박스 모달 */}
      {lightboxOpen && (
        <LightboxModal
          images={product.gallery}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={() => prevLightbox()}
          onNext={() => nextLightbox()}
        />
      )}
      </>
  );
}
