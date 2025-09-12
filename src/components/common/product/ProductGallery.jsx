import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function ProductGallery({ images = [], onOpenLightbox }) {
  return (
    <>
      <div className="block md:hidden mt-5">
        <Swiper
          slidesPerView={1}       // ← 한 장만 꽉 차게
          spaceBetween={0}        // ← 간격 0
          centeredSlides={false}  // ← 무조건 false
          loop={true}            // 무한 swipe
          pagination={{ clickable: true }} // 점 네비
          style={{ width: "100%" }}
        >
          {images.map((src, i) => (
            <SwiperSlide key={i}>
              <button
                onClick={() => onOpenLightbox?.(i)}
                aria-label={`open-image-${i}`}
                className="block w-full"
              >
                {/* 높이 통일하기 : 3:4 비율 고정, 안하면 어떤건 낮고, 높음 */}
                <div className="aspect-[3/4] w-full overflow-hidden rounded">
                  <img
                    src={src}
                    alt={`thumb-${i}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 데스크톱: 2열 그리드 */}
      <div className="hidden md:grid grid-cols-2 gap-2 mt-8">
        {images.map((src, i) => (
          <button
            key={i}
            className="relative group"
            onClick={() => onOpenLightbox?.(i)}
            aria-label={`open-image-${i}`}
          >
            {/* 데스크톱도 비율 고정 */}
            <div className="aspect-[3/4] w-full overflow-hidden rounded">
              <img
                src={src}
                alt={`thumb-${i}`}
                className="w-full h-full object-cover"
                loading="lazy"
                draggable={false}
              />
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
