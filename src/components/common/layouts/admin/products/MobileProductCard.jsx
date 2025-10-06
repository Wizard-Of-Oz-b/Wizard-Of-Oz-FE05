import { Pencil, Trash2 } from "lucide-react";
import Switch from "../common/Switch";

export default function MobileProductCard({
  product,
  code,
  imgSrc,
  categoryPath,
  priceText,
  createdText,
  isActive,
  onToggle,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* 이미지 영역 */}
      <div className="relative">
        {/* 토글 스위치 */}
        <div className="absolute right-2 top-2 z-10">
          <Switch checked={isActive} onChange={onToggle} />
        </div>

        <img
          src={imgSrc}
          alt={product?.name ?? "상품 이미지"}
          className="w-full aspect-[4/3] object-cover"
          loading="lazy"
          onError={(e) => {
            const FALLBACK_IMG = "/images/product-fallback.png";
            if (!e.currentTarget.src.endsWith(FALLBACK_IMG)) {
              e.currentTarget.src = FALLBACK_IMG;
            }
          }}
        />
      </div>

      <div className="p-4">
        {/* 코드 + 카테고리 */}
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[12px] text-gray-600">{code}</span>
        </div>
        <div className="text-xs text-gray-500 truncate" title={categoryPath}>
          {categoryPath}
        </div>

        {/* 상품명 */}
        <div className="mt-1 font-semibold text-gray-900 line-clamp-1">
          {product?.name ?? ""}
        </div>

        {/* 가격 */}
        <div className="mt-1 text-violet-700 font-extrabold">{priceText}</div>

        {/* 버튼 */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="h-10 inline-flex items-center justify-center gap-1 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700"
          >
            <Pencil className="w-4 h-4" /> 수정
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="h-10 inline-flex items-center justify-center gap-1 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4" /> 삭제
          </button>
        </div>

        {/* 등록일 */}
        <div className="mt-2 text-[11px] text-gray-500">
          등록일: {createdText}
        </div>
      </div>
    </div>
  );
}
