import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "../components/common/layouts/header/Header";
import HeroSlider from "../components/HeroSlider";
import HeroSubmenuOverlay from "../components/HeroSubmenuOverlay";

export default function Home() {
  const [activePrimary, setActivePrimary] = useState(null);
  const [index, setIndex] = useState(0);
  const lockRef = useRef(false);
  const [scrollLocked, setScrollLocked] = useState(true);

  const firstMountRef = useRef(true);

  const steps = [
    {
      kind: "image",
      src: { desktop: "/images/32.jpg", mobile: "/images/32.jpg" },
      title: "Everyday Essentials for Everyone",
      subtitle: "남성과 여성을 위한 실용적이고 스타일리시한 선택",
      ctaText: "Shop Now",
      ctaHref: "/results/list?page=1&sort=created_at&primary=MEN",
    },
    {
      kind: "image",
      src: { desktop: "https://vteallasuiryfibljlww.supabase.co/storage/v1/object/public/s/pexels-marcelochagas-2229490.jpg", mobile: "https://vteallasuiryfibljlww.supabase.co/storage/v1/object/public/s/pexels-marcelochagas-2229490.jpg" },
      title: "Daily Must-Haves for Her",
      subtitle: "매일을 위한 필수 아이템",
      ctaText: "Shop WOMEN",
      ctaHref: "/products/list?page=1&sort=created_at&primary=WOMEN&item=아우터&category_id=890fe0f0-7e72-4e9d-b3c2-5bb1e0461e9a",
    },
    {
      kind: "image",
      src: { desktop: "/images/4.jpg", mobile: "/images/4.jpg" },
      title: "Everyday Essentials for Men",
      subtitle: "스타일과 실용성의 완벽한 조화",
      ctaText: "Shop MEN",
      ctaHref: "/products/list?page=1&sort=created_at&primary=MEN&item=아우터&category_id=3fc714e3-8af1-4d06-a7c1-64f49c740e40",
    },
    {
      kind: "image",
      src: { desktop: "/images/5.jpg", mobile: "/images/5.jpg" },
      title: "Timeless Wardrobe Classics",
      subtitle: "오래도록 사랑받는 클래식 아이템",
      ctaText: "Shop WOMEN",
      ctaHref: "/products/list?page=1&sort=created_at&primary=WOMEN&item=긴팔&category_id=4483dd0f-7329-4cb2-a9a6-2b531e35682c",
    },
    {
      kind: "image",
      src: { desktop: "https://vteallasuiryfibljlww.supabase.co/storage/v1/object/public/s/pexels-flaviophotart-20425432.jpg", mobile: "https://vteallasuiryfibljlww.supabase.co/storage/v1/object/public/s/pexels-flaviophotart-20425432.jpg" },
      title: "Timeless Essentials for Women",
      subtitle: "시간이 지나도 변치 않는 스타일",
      ctaText: "Shop WOMEN",
      ctaHref: "/products/list?page=1&sort=created_at&primary=WOMEN&item=아우터&category_id=890fe0f0-7e72-4e9d-b3c2-5bb1e0461e9a",
    },
  ];

  const goTo = useCallback((i) => {
    if (i < 0 || i >= steps.length || lockRef.current) return;
    lockRef.current = true;
    setTimeout(() => {
      setIndex(i);
      setTimeout(() => (lockRef.current = false), 80);
    }, 260);
  }, [steps.length]);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.style.overscrollBehavior = "none";
    html.style.overflowX = "hidden";
    body.style.overflowX = "hidden";

    html.classList.add("scrollbar-hide");
    body.classList.add("scrollbar-hide");

    if (scrollLocked) {
      html.style.overflowY = "hidden";
      body.style.overflowY = "hidden";
      html.style.height = "100%";
      body.style.height = "100%";
    } else {
      html.style.overflowY = "auto";
      body.style.overflowY = "auto";
      html.style.height = "";
      body.style.height = "";
    }

    return () => {
      html.style.overscrollBehavior = "";
      html.style.overflowX = "";
      body.style.overflowX = "";
      html.style.overflowY = "";
      body.style.overflowY = "";
      html.style.height = "";
      body.style.height = "";
      html.classList.remove("scrollbar-hide");
      body.classList.remove("scrollbar-hide");
    };
  }, [scrollLocked]);

const unlockAndRevealFooter = () => {
  setScrollLocked(false);
  setTimeout(() => {
    document.querySelector("footer")?.scrollIntoView({ behavior: "smooth" });
  }, 30);
};


  useEffect(() => {
    const onWheel = (e) => {
      if (!scrollLocked || lockRef.current) return;
      if (e.deltaY > 30) {
        e.preventDefault();
        if (index < steps.length - 1) next();
        else unlockAndRevealFooter();
      } else if (e.deltaY < -30) {
        e.preventDefault();
        if (index > 0) prev();
      }
    };

    const onKey = (e) => {
      if (!scrollLocked) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        if (index < steps.length - 1) next();
        else unlockAndRevealFooter();
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        if (index > 0) prev();
      }
    };

    let startY = null;
    const onTouchStart = (e) => {
      if (!scrollLocked) return;
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
      if (!scrollLocked || startY == null) return;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dy) > 50) {
        if (dy < 0) {
          if (index < steps.length - 1) next();
          else unlockAndRevealFooter();
        } else {
          if (index > 0) prev();
        }
      }
      startY = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [index, next, prev, scrollLocked, steps.length]);

  // ===== Footer에서 다시 위로가기 =====
  useEffect(() => {
    if (scrollLocked) return;
    const onScroll = () => {
      if (window.scrollY <= 0) {
        setScrollLocked(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollLocked]);

  const handleDotClick = (i) => {
    if (i === index && scrollLocked) return;
    if (!scrollLocked) {
      setScrollLocked(true);
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
        setTimeout(() => goTo(i), 60);
      });
    } else {
      goTo(i);
    }
  };

  return (
    <>
      {/* 헤더 */}
      <Header
        onPrimarySelect={(p) => setActivePrimary(p)}
        className="fixed top-0 left-0 w-full z-[80]"
      />

      <HeroSubmenuOverlay
        primary={activePrimary}
        onClose={() => setActivePrimary(null)}
        onSelectSub={(sub) => {
          console.log("sub selected:", sub);
          setActivePrimary(null);
        }}
      />

      <div
        className={`relative min-h-screen flex-1 w-screen overflow-hidden bg-gray-800 ${
          !scrollLocked ? "pointer-events-none" : ""
        }`}
      >
        <HeroSlider
          steps={steps}
          index={index}
          activePrimary={activePrimary}
          setActivePrimary={setActivePrimary}
          firstMount={firstMountRef.current}
          onFirstFadeEnd={() => {
            firstMountRef.current = false;
          }}
        />
      </div>

      {/* 페이지네이션 */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-2">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`w-2 h-2 rounded-full ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}