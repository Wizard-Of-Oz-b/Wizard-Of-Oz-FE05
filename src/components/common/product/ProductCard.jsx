// import ProductOptions from "./ProductOptions";
// import RatingStars from "./RatingStars";

// // import { KRW } from "../models/product";

// // export default function ProductCard({ product, onClick }) {
// export default function ProductCard({data}) {


//   const onClickhandler = () => {
//     console.log('move to detail')
//   }

//   return(
// <div
//   className="flex flex-col cursor-pointer w-1/4 pb-8"
//   onClick={onClickhandler}
// >
//   <img
//     src={data.image_url || data.gallery?.[0] || "/fallback.png"}
//     alt={data.name}
//     className="w-full h-auto object-cover rounded-md"
//   />
//   <ProductOptions options={data.options} />

//   <p className={`font-extralight text-sm ${data?.is_active ? "text-black" : "text-gray-400"}`}>
//     카테고리 {data.category_name ?? data.category_id}
//   </p>
//   <p className={`font-medium text-lg ${data?.is_active ? "text-black" : "text-gray-400"}`}>
//     {data.name}
//   </p>
//   <p className={`font-bold text-lg ${data?.is_active ? "text-black" : "text-gray-400"}`}>
//     {Number(data.price).toLocaleString()}원
//   </p>
//   <span>{data?.is_active ? "" : "품절"}</span>
// </div>

//   )
// }






  // return (
  //   <button onClick={onClick} className="text-left rounded border border-gray-200 overflow-hidden bg-white hover:shadow-sm">
  //     <div className="aspect-[3/4] bg-gray-50">
  //       <img src={product.gallery?.[0]} alt={product.name} className="h-full w-full object-cover" />
  //     </div>
  //     <div className="p-3">
  //       <p className="text-xs text-gray-500">{product.brand}</p>
  //       <h3 className="mt-0.5 text-sm line-clamp-2">{product.name}</h3>
  //       <div className="mt-1">
  //         <RatingStars rating={product.rating} count={product.ratingCount} size={14} />
  //       </div>
  //       <div className="mt-1 font-medium">{KRW(product.price)}</div>

  //       {/* 색상 점프리뷰(최대 4개만) */}
  //       <div className="mt-2 flex gap-1">
  //         {(product.colors || []).slice(0, 4).map((c) => (
  //           <div key={c.code} className="h-3 w-3 rounded-full border border-gray-300" style={{ background: c.hex }} />
  //         ))}
  //       </div>
  //     </div>
  //   </button>
  // );
// }

// import { useEffect, useState } from "react";
// import ProductOptions from "./ProductOptions";
// import { fetchPublicMainImageUrl } from "../api/admin/productImages";

// export default function ProductCard({ data, onClick }) {
//   const pid = data.product_id || data.id;
//   const FALLBACK = "/fallback.png";

//   const [imgSrc, setImgSrc] = useState(
//     data.image_url || (Array.isArray(data.gallery) && data.gallery[0]) || FALLBACK
//   );

//   useEffect(() => {
//     setImgSrc(
//       data.image_url || (Array.isArray(data.gallery) && data.gallery[0]) || FALLBACK
//     );
//   }, [data.image_url, data.gallery]);

//   useEffect(() => {
//     if (!pid) return;
//     if (imgSrc && imgSrc !== FALLBACK) return;

//     let cancel = false;
//     (async () => {
//       const url = await fetchPublicMainImageUrl(pid);
//       if (!cancel && url) setImgSrc(url);
//     })();
//     return () => { cancel = true; };
//   }, [pid, imgSrc]);

//   return (
//     <div
//       className="
//         flex flex-col cursor-pointer
//         basis-1/2 md:basis-1/3 lg:basis-1/4
//         px-2 pb-8 overflow-hidden min-w-0
//       "
//       onClick={onClick || (() => console.log('move to detail'))}
//     >
//       {/* 가로 스크롤 방지 */}
//       <div className="w-full aspect-[2/3] rounded-md overflow-hidden">
//         <img
//           src={imgSrc}
//           alt={data.name}
//           className="w-full h-full object-cover block max-w-full"
//           onError={() => setImgSrc(FALLBACK)}
//         />
//       </div>

//       <ProductOptions options={data.options} />

//       <p className={`font-extralight text-sm ${data?.is_active ? "text-black" : "text-gray-400"}`}>
//         카테고리 {data.category_name ?? data.category_id}
//       </p>
//       <p className={`font-medium text-lg truncate ${data?.is_active ? "text-black" : "text-gray-400"}`}>
//         {data.name}
//       </p>
//       <p className={`font-bold text-lg ${data?.is_active ? "text-black" : "text-gray-400"}`}>
//         {Number(data.price).toLocaleString()}원
//       </p>
//       <span>{data?.is_active ? "" : "품절"}</span>
//     </div>
//   );
// }

import { useEffect, useMemo, useRef, useState } from "react";
import ProductOptions from "./ProductOptions";
import SmartImage from "./SmartImage";

const API_BASE = (import.meta.env.VITE_API_BASE || "").trim() || "/api";
const API_ORIGIN = API_BASE.startsWith("http")
  ? new URL(API_BASE).origin
  : window.location.origin;

function toAbsolute(u) {
  if (!u || typeof u !== "string") return null;
  const s = u.trim();
  if (!s || s.toLowerCase() === "string") return null;
  if (/^(https?:)?\/\//i.test(s)) return s;
  if (s.startsWith("data:")) return s;
  if (s.startsWith("/")) return API_ORIGIN + s;
  return API_ORIGIN + "/" + s;
}

function pickFromRow(row = {}) {
  const candidates = [
    row.image_url,
    row?.primary_image?.url,
    Array.isArray(row.images) ? row.images[0]?.url : null,
    Array.isArray(row.gallery) ? row.gallery[0] : null,
  ];
  for (const c of candidates) {
    const abs = toAbsolute(c);
    if (abs) return abs;
  }
  return null;
}

export default function ProductCard({ data = {}, onClick }) {
  const firstInit = useRef(true);
  const [imgSrc, setImgSrc] = useState(null);
  const [useSmart, setUseSmart] = useState(false);

  const initial = useMemo(() => pickFromRow(data), [data]);

  useEffect(() => {
    setUseSmart(false);
    setImgSrc(initial || null);

    if (firstInit.current) {
      firstInit.current = false;
    }
  }, [initial]);

  const handleError = () => {
    setUseSmart(true);
  };

  return (
    <div
      className="
        flex flex-col cursor-pointer
        basis-1/2 md:basis-1/3 lg:basis-1/4
        px-2 pb-8 overflow-hidden min-w-0
      "
      onClick={onClick || (() => {})}
    >
      <div className="w-full aspect-[2/3] rounded-md overflow-hidden">
        {/* 1순위: 정상 URL이면 일반 <img> */}
        {!useSmart && !!imgSrc ? (
          <img
            src={imgSrc}
            alt={data.name || "상품"}
            className="w-full h-full object-cover block max-w-full"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={handleError}
          />
        ) : (
          // 2순위: 실패/없음 → SmartImage (프록시 재시도 + SVG 폴백)
          <SmartImage
            src={imgSrc || ""} 
            alt={data.name || "상품"}
            name={data.name}
            category={data.category_name}
            className="w-full h-full object-cover block max-w-full"
          />
        )}
      </div>

      <ProductOptions options={data.options} />

      <p className={`font-extralight text-sm ${data?.is_active ? "text-black" : "text-gray-400"}`}>
        카테고리 {data.category_name ?? data.category_id}
      </p>
      <p className={`font-medium text-lg truncate ${data?.is_active ? "text-black" : "text-gray-400"}`}>
        {data.name}
      </p>
      <p className={`font-bold text-lg ${data?.is_active ? "text-black" : "text-gray-400"}`}>
        {Number(data.price ?? 0).toLocaleString()}원
      </p>
      <span>{data?.is_active ? "" : "품절"}</span>
    </div>
  );
}
