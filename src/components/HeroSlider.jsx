import React, { useEffect, useMemo, useRef } from "react";

export default function HeroSlider({
  steps = [],
  index = 0,
  activePrimary,
  setActivePrimary,
  firstMount,
  onFirstFadeEnd,
}) {
  const videoRefs = useRef([]);

  const safeSteps = Array.isArray(steps) ? steps : []; 
  const safeIndex = Math.min(Math.max(0, index), Math.max(0, safeSteps.length - 1));

  useEffect(() => {
    if (!safeSteps.length) return; 
    safeSteps.forEach((step, i) => {
      if (!step || step.kind !== "video") return;
      const v = videoRefs.current[i];
      if (!v) return;
      const playActive = i === safeIndex;
      try {
        if (playActive) {
          v.muted = true;
          v.playsInline = true;
          const p = v.play();
          if (p && typeof p.catch === "function") p.catch(() => {});
        } else {
          v.pause();
          v.currentTime = 0;
        }
      } catch {}
    });
  }, [safeIndex, safeSteps]);

  const slideA11y = useMemo(
    () =>
      safeSteps.map((_, i) => ({
        role: "group",
        "aria-roledescription": "slide",
        "aria-current": i === safeIndex ? "true" : undefined,
      })),
    [safeSteps, safeIndex]
  );

  if (!safeSteps.length) {
    // ✅ steps가 아직 안 들어온 초기 상태 처리(스켈레톤)
    return <div className="w-full h-screen bg-black/5" />;
  }

  return (
    <div className="absolute inset-0">
      {safeSteps.map((step, i) => {
        const isActive = i === safeIndex;
        return (
          <div
            key={i}
            {...slideA11y[i]}
            className={`absolute inset-0 transition-opacity duration-500 ease-out ${
              isActive ? "opacity-100 z-20" : "opacity-0 z-10"
            }`}
          >
            {step.kind === "image" ? (
              <PictureFill src={step.src} alt={step.title} />
            ) : (
              <VideoFill
                src={step.src}
                poster={step.poster}
                options={step.videoOptions}
                ref={(el) => (videoRefs.current[i] = el)}
              />
            )}

            <div className="absolute inset-0 flex items-center justify-start text-center px-6">
              <div
                className={`max-w-3xl text-white drop-shadow-xl transition-all ${
                  isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                } select-none`}
              >
                <h2
                  className="text-4xl md:text-6xl font-bold text-white uppercase tracking-wider"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
                >
                  {step.title}
                </h2>

                {step.subtitle && (
                  <p
                    className="mt-3 md:mt-4 text-lg md:text-2xl text-white/90 uppercase"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                  >
                    {step.subtitle}
                  </p>
                )}

                {step.ctaText && (
                  <a
                    href={step.ctaHref || "#"}
                    className="inline-block mt-5 md:mt-8 px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-white/90 text-gray-900 font-semibold hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/80"
                  >
                    {step.ctaText}
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 반응형 이미지
function PictureFill({ src, alt }) {
  const desk = src?.desktop ?? src;
  const mob = src?.mobile ?? src?.desktop ?? src;
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desk} />
      <img
        src={mob}
        alt={alt || ""}
        className="w-full h-screen object-cover"
        loading="eager"
        fetchPriority="high"
      />
    </picture>
  );
}

const VideoFill = React.forwardRef(function VideoFill({ src, poster, options }, ref) {
  const opts = { loop: true, muted: true, autoPlay: true, ...options };
  const isClient = typeof window !== "undefined";                   // ✅ SSR 안전
  const posterSrc =
    (poster &&
      (isClient && window.innerWidth >= 768 ? poster.desktop : poster.mobile)) ||
    undefined;

  const desk = src?.desktop ?? src;
  const mob = src?.mobile ?? src?.desktop ?? src;

  return (
    <video
      ref={ref}
      className="w-full h-screen object-cover"
      poster={posterSrc}
      preload="auto"
      playsInline
      muted={opts.muted}
      loop={opts.loop}
      autoPlay={opts.autoPlay}
    >
      <source src={desk} type="video/mp4" media="(min-width: 768px)" />
      <source src={mob} type="video/mp4" />
    </video>
  );
});
