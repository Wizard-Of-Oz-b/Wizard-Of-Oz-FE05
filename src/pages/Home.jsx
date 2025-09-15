import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "../components/common/layouts/header/Header";
import Footer from "../components/common/layouts/footer/Footer";
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
      title: "Everyday Essentials for Men",
      subtitle: "스타일과 실용성의 완벽한 조화",
      ctaText: "Shop Kids",
      ctaHref: "/kids",
    },
    {
      kind: "video",
      src: { desktop: "/images/1.mp4", mobile: "/images/1.mp4" },
      poster: { desktop: "/images/2.jpg", mobile: "/images/1.jpg" },
      title: "Men’s Essentials",
      subtitle: "스타일과 편안함의 조화",
      ctaText: "Shop Women",
      ctaHref: "/women",
    },
    {
      kind: "image",
      src: { desktop: "/images/31.jpg", mobile: "/images/31.jpg" },
      title: "Everyday Essentials for Men",
      subtitle: "스타일과 실용성의 완벽한 조화",
      ctaText: "Shop Kids",
      ctaHref: "/kids",
    },
    {
      kind: "image",
      src: { desktop: "/images/4.jpg", mobile: "/images/4.jpg" },
      title: "Everyday Essentials for Men",
      subtitle: "스타일과 실용성의 완벽한 조화",
      ctaText: "Shop Kids",
      ctaHref: "/kids",
    },
    {
      kind: "image",
      src: { desktop: "/images/5.jpg", mobile: "/images/5.jpg" },
      title: "Everyday Classics for Men",
      subtitle: "시간이 지나도 변치 않는 스타일",
      ctaText: "Shop Men",
      ctaHref: "/kids",
    },
  ];

  // ===== 전환 도우미 =====
  const goTo = useCallback(
    (i) => {
      if (i < 0 || i >= steps.length || lockRef.current) return;
      lockRef.current = true;
      setTimeout(() => {
        setIndex(i);
        setTimeout(() => (lockRef.current = false), 80);
      }, 260);
    },
    [steps.length]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  function snapToTopHard() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 60);
  }

  // ===== 전역 스타일 잠금/해제 =====
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // 바운스 방지
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

      requestAnimationFrame(() => snapToTopHard());
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
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
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

  useEffect(() => {
    if (scrollLocked) return;

    const TOP_ZONE = 80; 
    let touchStartY = null;

    const getY = () =>
      window.scrollY ??
      document.documentElement.scrollTop ??
      document.body.scrollTop ??
      0;

    const isNearTop = () => getY() <= TOP_ZONE;

    const onWheelUpNearTop = (e) => {
      if (e.deltaY < -30 && isNearTop()) {
        e.preventDefault(); 
        snapToTopHard();
        setScrollLocked(true);
      }
    };

    const onTouchStart = (e) => {
      touchStartY = e.touches?.[0]?.clientY ?? null;
    };
    const onTouchMove = (e) => {
      if (touchStartY == null) return;
      const dy = (e.touches?.[0]?.clientY ?? 0) - touchStartY;
      if (dy > 60 && isNearTop()) {
        e.preventDefault();
        snapToTopHard();
        setScrollLocked(true);
      }
    };

    window.addEventListener("wheel", onWheelUpNearTop, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheelUpNearTop);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [scrollLocked]);

  useEffect(() => {
    if (scrollLocked) return;

    const LOCK_THRESHOLD = 20;
    const STABLE_MS = 30; 
    let timer = null;
    let lastY = null;

    const onScroll = () => {
      const y =
        window.scrollY ??
        document.documentElement.scrollTop ??
        document.body.scrollTop ??
        0;

      if (y <= LOCK_THRESHOLD) {
        if (lastY !== null && Math.abs(lastY - y) > 1) {
          clearTimeout(timer);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
          setScrollLocked(true);
          requestAnimationFrame(() => snapToTopHard());
        }, STABLE_MS);
      } else {
        clearTimeout(timer);
      }
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [scrollLocked]);

  // ===== 점 네비 클릭 =====
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
      {/* 헤더 고정 */}
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

      <div className="relative h-screen w-screen overflow-hidden bg-gray-800">
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

      {!scrollLocked && <Footer />}
    </>
  );
}
