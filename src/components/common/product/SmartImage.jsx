import { useEffect, useRef, useState } from "react";

function toProxy(url) {
  try {
    if (!/^https?:\/\//i.test(url || "")) return null;
    const noScheme = url.replace(/^https?:\/\//i, "");
    return `https://images.weserv.nl/?url=${encodeURIComponent(noScheme)}`;
  } catch {
    return null;
  }
}

function colorFromString(s = "") {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  const hue = Math.abs(h) % 360;
  return `hsl(${hue} 55% 90%)`;
}
function initials(name = "") {
  const words = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "NO";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
function categoryGlyph(category = "") {
  const c = (category || "").toLowerCase();
  if (c.includes("상의") || c.includes("top")) return "👕";
  if (c.includes("하의") || c.includes("pants") || c.includes("바지")) return "👖";
  if (c.includes("원피스") || c.includes("dress")) return "👗";
  if (c.includes("아우터") || c.includes("자켓") || c.includes("코트")) return "🧥";
  return "🛍️";
}

function FallbackSVG({ name, category }) {
  const bg = colorFromString(name || category || "fallback");
  const glyph = categoryGlyph(category);
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" style={{ background: bg }} xmlns="http://www.w3.org/2000/svg">
      <text x="50" y="52" textAnchor="middle" fontSize="40" dominantBaseline="middle">{glyph}</text>
      <text x="50" y="88" textAnchor="middle" fontSize="9" fill="#334155" fontFamily="ui-sans-serif, system-ui">
        {String(name || category || "NO IMAGE").slice(0, 22)}
      </text>
    </svg>
  );
}

export default function SmartImage({
  src,
  alt = "image",
  name = "",
  category = "",
  className = "",
  useParentAspect = false,
  rounded = "md",
}) {
  const [fail, setFail] = useState(false);
  const [imgSrc, setImgSrc] = useState(src || "");
  const proxiedOnce = useRef(false);

  useEffect(() => {
    setFail(false);
    setImgSrc(src || "");
    proxiedOnce.current = false;
  }, [src]);

  const onError = () => {
    if (!proxiedOnce.current && /^https?:\/\//i.test(imgSrc || "")) {
      proxiedOnce.current = true;
      const proxy = toProxy(imgSrc);
      if (proxy) {
        setImgSrc(proxy);
        return;
      }
    }
    setFail(true);
  };

  const radius = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  }[rounded] || "rounded-md";

  return (
    <div className={`relative overflow-hidden ${radius} ${className}`}>
      {(!fail && !!imgSrc) ? (
        <img
          src={imgSrc}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={onError}
        />
      ) : (
        <div className="absolute inset-0">
          <FallbackSVG name={name} category={category} />
        </div>
      )}
      {!useParentAspect && (
        <div className="invisible" aria-hidden />
      )}
    </div>
  );
}
