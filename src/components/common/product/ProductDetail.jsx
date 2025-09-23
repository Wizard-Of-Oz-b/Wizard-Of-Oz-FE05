import { useEffect, useMemo, useState } from 'react';
import { Heart, ShoppingCart, ChevronDown } from 'lucide-react';
import { KRW, LS_RECENT } from '../../../models/product';
import RatingStars from './RatingStars';
import ColorSwatches from './ColorSwatches';
import SizeSelector from './SizeSelector';
import QtyInput from './QtyInput';
import ProductGallery from './ProductGallery';
import LightboxModal from './LightboxModal';
import ReviewSection from '../layouts/reviews/ReviewSection';
import ProductDescription from './ProductDescription';
import {
  addWishlist,
  listWishlist,
  removeWishlist,
} from '../api/public/wishlist';
import HeartBurst from '../layouts/wishlist/components/HeartBurst';
import { motion } from "framer-motion"; // ✅ whileTap, spring 등 사용

export default function ProductDetail({ product, onAddToCart }) {
  const [color, setColor] = useState(product.colors?.[0]?.code);
  const [size, setSize] = useState(product.sizes?.[0] || 'M');
  const [qty, setQty] = useState(1);
  const [wish, setWish] = useState(false);
  const [wishId, setWishId] = useState(null);

  // ✅ 하트 파티클 관련 상태
  const [burstKey, setBurstKey] = useState(0);
  const [allowBurst, setAllowBurst] = useState(true);

  // (선택) 시스템 접근성 설정에 따라 모션 줄이기
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mq) setAllowBurst(!mq.matches);
  }, []);

  const option_key = '';
  const optionsStr = `color=${color || ''};size=${size || ''}`;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (i) => {
    setLightboxIndex(i);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const prevLightbox = () =>
    setLightboxIndex(
      (i) => (i - 1 + product.gallery.length) % product.gallery.length
    );
  const nextLightbox = () =>
    setLightboxIndex((i) => (i + 1) % product.gallery.length);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_RECENT);
      const arr = raw ? JSON.parse(raw) : [];
      const item = {
        id: product.id,
        name: product.name,
        img: product.gallery?.[0],
        price: product.price,
      };
      const next = [item, ...arr.filter((x) => x.id !== item.id)].slice(0, 12);
      localStorage.setItem(LS_RECENT, JSON.stringify(next));
    } catch {}
  }, [product]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rows = await listWishlist();
        if (!mounted) return;
        const found = rows.find(
          (r) =>
            r.product_id === product.product_id || r.product_id === product.id
        );
        if (found) {
          setWish(true);
          setWishId(found.wishlist_id);
        } else {
          setWish(false);
          setWishId(null);
        }
      } catch (e) {
        console.debug('wishlist preload failed', e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [product]);

  const toggleWish = async () => {
    const prevWish = wish;
    setWish(!prevWish);

    try {
      if (!prevWish) {
        // 추가
        await addWishlist({
          product_id: product.product_id || product.id,
          option_key,
          options: optionsStr,
        });
        const rows = await listWishlist();
        const found = rows.find(
          (r) => r.product_id === (product.product_id || product.id)
        );
        setWishId(found?.wishlist_id ?? null);

        if (allowBurst) setBurstKey((k) => k + 1);
      } else {
        if (wishId) {
          await removeWishlist(wishId);
          setWishId(null);
        } else {
          const rows = await listWishlist();
          const found = rows.find(
            (r) => r.product_id === (product.product_id || product.id)
          );
          if (found) {
            await removeWishlist(found.wishlist_id);
          }
        }
      }
    } catch (e) {
      setWish(prevWish);
      console.error('wishlist toggle failed', e);
      alert('위시리스트 처리 중 오류가 발생했어요.');
    }
  };

  const price = useMemo(() => KRW(product.price), [product.price]);

  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        <div className="order-1 lg:order-1 lg:col-span-8">
          <ProductGallery
            images={product.gallery}
            onOpenLightbox={openLightbox}
          />
        </div>

        <aside className="order-2 lg:order-2 lg:col-span-4">
          <div className="lg:sticky lg:top-20">
            <p className="text-xs tracking-wider text-gray-500">
              {product.brand}
            </p>
            <h1 className="mt-1 text-2xl font-semibold leading-snug">
              {product.name}
            </h1>

            <div className="mt-1">
              <RatingStars
                rating={product.rating}
                count={product.ratingCount}
              />
            </div>

            <div className="mt-3 text-[28px] font-medium">{price}</div>

            {/* 색상 */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">색상</p>
                <p className="text-xs text-gray-500">상품번호: {product.id}</p>
              </div>
              <ColorSwatches
                colors={product.colors}
                value={color}
                onChange={setColor}
              />
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
              <SizeSelector
                sizes={product.sizes}
                value={size}
                onChange={setSize}
              />
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

              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.92 }} 
                  onClick={toggleWish}
                  aria-pressed={wish}
                  className={`relative inline-flex items-center justify-center rounded border px-3 py-2 ${
                    wish
                      ? 'border-rose-500 text-rose-500'
                      : 'border-gray-300 text-gray-700'
                  }`}
                  title="위시리스트"
                >
                  <motion.span
                    key={wish ? 'on' : 'off'}
                    initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 20 }}
                    className="flex"
                  >
                    <Heart className={wish ? 'fill-rose-500' : ''} />
                  </motion.span>
                </motion.button>

                <HeartBurst show={wish && burstKey > 0} onDone={() => {}} />
              </div>
            </div>

            <ul className="mt-3 text-sm text-gray-600 space-y-1">
              <li>5만원 이상 무료 배송</li>
              <li>일부 품목 무료 반품</li>
            </ul>
          </div>
        </aside>

        <div className="order-3 lg:order-3 lg:col-span-8">
          <ProductDescription description={product.description}/>
        </div>

        <div className="order-4 lg:order-4 lg:col-span-8">
          <ReviewSection
            productId={product.product_id}
            currentUserId={123}
            isAdmin={false}
            onToast={(type, msg) => alert(`${type}: ${msg}`)}
          />
        </div>
      </section>

      {/* 라이트박스 */}
      {lightboxOpen && (
        <LightboxModal
          images={product.gallery}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevLightbox}
          onNext={nextLightbox}
        />
      )}
    </>
  );
}
