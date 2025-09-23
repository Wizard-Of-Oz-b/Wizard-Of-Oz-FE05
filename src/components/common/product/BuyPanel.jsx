import { useMemo } from 'react';
import { Heart, ShoppingCart, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import RatingStars from './RatingStars';
import ColorSwatches from './ColorSwatches';
import SizeSelector from './SizeSelector';
import QtyInput from './QtyInput';
import HeartBurst from '../layouts/wishlist/components/HeartBurst';
import { KRW } from '../../../models/product';

export default function BuyPanel({
  product,
  color,
  size,
  qty,
  onChangeColor,
  onChangeSize,
  onChangeQty,
  onAddToCart,
  wish,
  toggleWish,
  burstKey,
}) {
  const price = useMemo(() => KRW(product.price), [product.price]);

  return (
    <div className="flex flex-col gap-5">
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
        <ColorSwatches colors={product.colors} value={color} onChange={onChangeColor} />
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
        <SizeSelector sizes={product.sizes} value={size} onChange={onChangeSize} />
      </div>

      {/* 수량 + 액션 */}
      <div className="mt-5 flex gap-3">
        <QtyInput value={qty} onChange={onChangeQty} />
        <button
          onClick={() => onAddToCart?.({ product, color, size, qty })}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded bg-black px-4 py-3 text-white hover:bg-gray-900"
        >
          <ShoppingCart size={18} /> 장바구니 담기
        </button>
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleWish}
            aria-pressed={wish}
            className={`relative inline-flex items-center justify-center rounded border px-3 py-2 ${
              wish ? 'border-rose-500 text-rose-500' : 'border-gray-300 text-gray-700'
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
  );
}
