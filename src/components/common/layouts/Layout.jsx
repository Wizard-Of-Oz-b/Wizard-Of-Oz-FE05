import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import HeaderLight from "./header/HeaderLight";
import Footer from "./footer/Footer";
import { useAuth } from "../../../context/AuthContext";
import ScrollToTop from "./ScrollToTop";
import api from "../../../lib/axios";
import { useCartCount } from "../../../store/cartCount";

export default function Layout() {
  const { pathname } = useLocation();
  const { isLoggedIn, user } = useAuth();
  const setCartCount = useCartCount((s) => s.set);

  const noHeaderPadPages = ["/mypage", "/info", "/login", "/signup", "/brand"];
  const noHeaderPad = noHeaderPadPages.some((p) => pathname.startsWith(p));

  React.useEffect(() => {
    if (!isLoggedIn) {
      setCartCount(0);
      return;
    }
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/v1/carts/me/");
        const totalQty =
          (typeof data?.item_count === "number" ? data.item_count : null) ??
          (Array.isArray(data?.items)
            ? data.items.reduce((sum, it) => sum + (it.quantity || 0), 0)
            : 0);
      if (alive) setCartCount(totalQty);
    } catch (e) {
      if (alive) setCartCount(0);
      console.debug("cart bootstrap failed", e);
    }
  })();
  return () => { alive = false; };
}, [isLoggedIn, user?.id, setCartCount]);

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLight isLoggedIn={isLoggedIn} user={user} />
      <main className={`flex-1 ${noHeaderPad ? "pt-17" : "pt-24"}`}>
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
