// 카트 날아가는거 ~
import { useCallback } from "react";

export function useFlyToCart(cartDockRef) {
  const flyToCart = useCallback((imgEl) => {
    const cartEl = cartDockRef?.current;
    if (!imgEl || !cartEl) return;

    const s = imgEl.getBoundingClientRect();
    const e = cartEl.getBoundingClientRect();

    const ghost = imgEl.cloneNode(true);
    Object.assign(ghost.style, {
      position: "fixed",
      left: `${s.left}px`,
      top: `${s.top}px`,
      width: `${s.width}px`,
      height: `${s.height}px`,
      borderRadius: "12px",
      zIndex: 70,
      pointerEvents: "none",
    });
    document.body.appendChild(ghost);

    const dx = e.left + e.width / 2 - (s.left + s.width / 2);
    const dy = e.top + e.height / 2 - (s.top + s.height / 2);

    ghost
      .animate(
        [
          { transform: "translate(0,0) scale(1)", opacity: 1 },
          { transform: `translate(${dx * 0.7}px, ${dy * 0.7}px) scale(0.5)`, opacity: 0.9, offset: 0.8 },
          { transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0 },
        ],
        { duration: 600, easing: "cubic-bezier(.2,.7,.2,1)" }
      )
      .onfinish = () => ghost.remove();
  }, [cartDockRef]);

  return flyToCart;
}
