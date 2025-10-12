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
  fetchWishlistCount,
  listWishlist,
  removeWishlist,
} from '../api/public/wishlist';
import HeartBurst from '../layouts/wishlist/components/HeartBurst';
import { motion } from "framer-motion"; // ✅ whileTap, spring 등 사용
import { addCartItem } from '../../../hooks/cart/cartHook';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAlertModal } from '../layouts/common/modal/useAlertModal';  // 모달 컴포넌트 변경
import SizeGuideModal from './SizeGuideModal';
import { useProductOptionStock } from '../../../hooks/useProductOptionStock';
import { useCartCount } from '../../../store/cartCount';
import { useWishlistCount } from '../../../store/wishlistCount';

export default function ProductDetail({ product, onAddToCart, onToast }) {
  const [color, setColor] = useState(product.colors?.[0]?.code);
  const [size, setSize] = useState(product.sizes?.[0] || 'M');
  const [qty, setQty] = useState(1);
  const [wish, setWish] = useState(false);
  const [wishId, setWishId] = useState(null);
  const [adding, setAdding] = useState(false);
  // ✅ 하트 파티클 관련 상태
  const [burstKey, setBurstKey] = useState(0);
  const [allowBurst, setAllowBurst] = useState(true);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { showModal, ModalComponent } = useAlertModal();
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const imgs = product?.gallery ?? [];
  const { inc } = useCartCount.getState();
  const setWishlistCount = useWishlistCount((s) => s.set);

  const { isSizeDisabled, isColorDisabled, currentAvailable, currentQty } = useProductOptionStock({
    product,
    color,
    setColor,
    size,
    setSize,
  });

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mq) setAllowBurst(!mq.matches);
  }, []);

  const shortId = (id) => {
    if (!id) return "-";
    const s = String(id).replace(/-/g, "");
    return s.slice(0, 8);
  }

const option_key = new URLSearchParams(
Object.fromEntries(
     Object.entries({ color, size }).filter(([,v]) => v) // 빈 값 제거
   )
 ).toString();

  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = (i) => {
    setIndex(i);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);

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

    if (!isLoggedIn) {
      setWish(false);
      setWishId(null);
      return;
    }

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

  const requireLogin = () => {
    showModal({
      type: "warning",
      title: "로그인이 필요합니다",
      message: "해당 기능은 회원 전용입니다. 로그인 페이지로 이동할게요.",
    });
    setTimeout(() => navigate("/login"), 1200);
  };

  const toggleWish = async () => {
    // 조미현멘토님 피드백 
    if (!isLoggedIn) {
      requireLogin();
      return;
    }

    const prevWish = wish;
    setWish(!prevWish);

    try {
      if (!prevWish) {
        await addWishlist({
          product_id: product.product_id || product.id,
          option_key,
          options: `color=${color || ""};size=${size || ""}`
        });
        const rows = await listWishlist();
        const found = rows.find(
          (r) => r.product_id === (product.product_id || product.id)
        );
        setWishId(found?.wishlist_id ?? null);

        if (allowBurst) setBurstKey((k) => k + 1);
        setWishlistCount(await fetchWishlistCount());
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
        setWishlistCount(await fetchWishlistCount());
      }
    } catch (e) {
      setWish(prevWish);
      console.error('wishlist toggle failed', e);
      onToast?.('error', '위시리스트 처리 중 오류가 발생했어요.');
    }
  };

  const price = useMemo(() => KRW(product.price), [product.price]);

  const handleAddToCart = async () => {
    if (!currentAvailable) {
      onToast?.('error', '선택한 옵션은 현재 품절이에요.');
      return;
    }
    if (!isLoggedIn) {
      requireLogin();
      return;
    }
    if (adding) return;
    setAdding(true);
    try {
      const product_id = product.product_id ?? product.id;
      if (!product_id) throw new Error('missing product_id');

      if (typeof onAddToCart === 'function') {
        await onAddToCart({ product, option_key, qty });
        inc(qty ?? 1);
      } else if (typeof addCartItem === 'function') {
        await addCartItem({
          product_id,
          option_key,
          quantity: qty ?? 1,
        });
        inc(qty ?? 1);
        onToast?.('success', '장바구니에 담겼어요.');
      } else {
        throw new Error('addCartItem not available (import path?)');
      }
    } catch (e) {
      console.error(e);
      onToast?.('error', '장바구니 담기 중 오류가 발생했어요.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        <div className="order-1 lg:order-1 lg:col-span-8">
          <ProductGallery
            images={imgs}
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
                <p className="text-xs text-gray-500">
                  상품번호: {shortId(product.product_id ?? product.id)}
                </p>
              </div>
              <ColorSwatches
                colors={product.colors}
                value={color}
                onChange={setColor}
                isDisabled={isColorDisabled}
              />
              <p className="mt-2 text-xs text-gray-600">
                {product.colors?.find((c) => c.code === color)?.name}
              </p>
            </div>

            {/* 사이즈 */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">사이즈</p>
                <button 
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800"
                >
                  사이즈 가이드 <ChevronDown size={14} />
                </button>
              </div>
              <SizeSelector
                sizes={product.sizes}
                value={size}
                onChange={setSize}
                isDisabled={isSizeDisabled}
              />
            </div>

            {/* 수량 + 액션 */}
            <div className="mt-5 flex gap-3">
              <QtyInput value={qty} onChange={setQty} />
              { !currentAvailable && (
                <p className="sr-only">현재 선택한 옵션은 품절입니다.</p>
              )}
              <button
                onClick={handleAddToCart}
                disabled={adding || !currentAvailable}
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded px-4 py-3 text-white ${
                  adding || !currentAvailable
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-black hover:bg-gray-900'
                }`}
              >
                <ShoppingCart size={18} />
                {adding
                  ? '담는 중…'
                  : !currentAvailable
                    ? '옵션 품절'
                    : '장바구니 담기'}
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
            onToast={onToast}
          />
        </div>
      </section>

      {/* 라이트박스 */}
      {lightboxOpen && imgs.length > 0 && (
        <LightboxModal
          images={imgs}
          index={index}
          onChange={setIndex}
          onClose={closeLightbox}
        />
      )}

      <SizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        sizeChart={product.size_chart}
      />

      {ModalComponent}
    </>
  );
}