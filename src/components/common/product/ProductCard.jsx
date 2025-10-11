import { useEffect, useMemo, useRef, useState } from "react";
import ProductOptions from "./ProductSelectOptions";
import SmartImage from "./SmartImage";
import { Link } from "react-router-dom";

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

export default function ProductCard({ data = {}, to, onClick }) {
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

  const Container = to ? Link : "div";
  const containerProps = to
    ? { to }
    : { onClick: onClick || (() => {}) };

  return (
    <Container
      className="
        flex flex-col cursor-pointer
        basis-1/2 md:basis-1/3 lg:basis-1/4
        px-2 pb-8 overflow-hidden min-w-0
      "
      {...containerProps}
    >
      <div className="w-full aspect-[2/3] rounded-md overflow-hidden">
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
    </Container>
  );
}
