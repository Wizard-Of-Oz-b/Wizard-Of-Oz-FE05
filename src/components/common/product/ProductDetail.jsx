import { useEffect, useState } from 'react';
import ProductGallery from './ProductGallery';
import ProductDescription from './ProductDescription';
import ReviewSection from '../layouts/reviews/ReviewSection';
import LightboxModal from './LightboxModal';
import { LS_RECENT } from '../../../models/product';
import { addWishlist, listWishlist, removeWishlist } from '../api/public/wishlist';
import BuyPanel from './BuyPanel';

export default function ProductDetail({ product, onAddToCart }) {
  const [color, setColor] = useState(product.colors?.[0]?.code);
  const [size, setSize] = useState(product.sizes?.[0] || 'M');
  const [qty, setQty] = useState(1);
  const [wish, setWish] = useState(false);
  const [wishId, setWishId] = useState(null);
  const [burstKey, setBurstKey] = useState(0);
  const [allowBurst, setAllowBurst] = useState(true);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mq) setAllowBurst(!mq.matches);
  }, []);

  const option_key = '';
  const optionsStr = `color=${color || ''};size=${size || ''}`;

  const openLightbox = (i) => { setLightboxIndex(i); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const prevLightbox = () => setLightboxIndex((i) => (i - 1 + product.gallery.length) % product.gallery.length);
  const nextLightbox = () => setLightboxIndex((i) => (i + 1) % product.gallery.length);

  // 최근 본 상품
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
          (r) => r.product_id === product.product_id || r.product_id === product.id
        );
        if (found) { setWish(true); setWishId(found.wishlist_id); } 
        else { setWish(false); setWishId(null); }
      } catch (e) { console.debug('wishlist preload failed', e); }
    })();
    return () => { mounted = false; };
  }, [product]);

  const toggleWish = async () => {
    const prevWish = wish;
    setWish(!prevWish);
    try {
      if (!prevWish) {
        await addWishlist({ product_id: product.product_id || product.id, option_key, options: optionsStr });
        const rows = await listWishlist();
        const found = rows.find((r) => r.product_id === (product.product_id || product.id));
        setWishId(found?.wishlist_id ?? null);
        if (allowBurst) setBurstKey((k) => k + 1);
      } else {
        if (wishId) { await removeWishlist(wishId); setWishId(null); }
        else {
          const rows = await listWishlist();
          const found = rows.find((r) => r.product_id === (product.product_id || product.id));
          if (found) { await removeWishlist(found.wishlist_id); }
        }
      }
    } catch (e) { setWish(prevWish); console.error('wishlist toggle failed', e); alert('위시리스트 처리 중 오류가 발생했어요.'); }
  };

  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* 좌측: 갤러리 + 상세 + 리뷰 */}
        <div className="order-1 lg:order-1 lg:col-span-8 flex flex-col gap-8">
          <ProductGallery images={product.gallery} onOpenLightbox={openLightbox} />

          {/* 모바일 */}
          <div className="lg:hidden">
            <BuyPanel
              product={product}
              color={color}
              size={size}
              qty={qty}
              onChangeColor={setColor}
              onChangeSize={setSize}
              onChangeQty={setQty}
              onAddToCart={onAddToCart}
              wish={wish}
              toggleWish={toggleWish}
              burstKey={burstKey}
            />
          </div>

          <ProductDescription description={product.description} />
          <ReviewSection
            productId={product.product_id}
            currentUserId={123}
            isAdmin={false}
            onToast={(type, msg) => alert(`${type}: ${msg}`)}
          />
        </div>

        {/* 데스크탑 */}
        <aside className="hidden lg:block lg:order-2 lg:col-span-4">
          <div className="lg:sticky lg:top-20">
            <BuyPanel
              product={product}
              color={color}
              size={size}
              qty={qty}
              onChangeColor={setColor}
              onChangeSize={setSize}
              onChangeQty={setQty}
              onAddToCart={onAddToCart}
              wish={wish}
              toggleWish={toggleWish}
              burstKey={burstKey}
            />
          </div>
        </aside>
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
