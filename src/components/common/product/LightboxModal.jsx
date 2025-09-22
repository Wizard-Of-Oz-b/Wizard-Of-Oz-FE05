// 제품 상세페이지 확대해서 보여주는 모달

import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function LightboxModal({ images = [], index = 0, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  if (!images.length) return null;
  const src = images[index];

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
      {/* 배경 클릭 시 닫기*/}
      <button className="absolute inset-0 cursor-zoom-out" onClick={onClose} aria-label="close" />
      {/* 메인 이미지 */}
      <div className="relative z-10 max-w-[90vw] max-h-[85vh]">
        <img src={src} alt="" className="max-w-[90vw] max-h-[85vh] object-contain" />
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/90 hover:text-white"
          aria-label="close"
        >
          <X size={28} />
        </button>
      </div>
      {/* 좌/우 네비게이션 */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/90 hover:text-white"
            aria-label="prev"
          >
            <ChevronLeft size={40} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext?.(); }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/90 hover:text-white"
            aria-label="next"
          >
            <ChevronRight size={40} />
          </button>
        </>
      )}

      {/* 하단 썸네일 네비 */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2 px-4">
          <div className="flex gap-2 overflow-x-auto max-w-[90vw]">
            {images.map((s, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); if (i < index) onPrev?.(i); else if (i > index) onNext?.(i); }}
                className={`h-24 w-12 md:w-16 rounded overflow-hidden border ${i === index ? "border-white" : "border-white/30"}`}
                aria-label={`thumb-${i}`}
              >
                <img src={s} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
