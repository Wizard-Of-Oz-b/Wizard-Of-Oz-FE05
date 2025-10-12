import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import { useEffect } from "react";
import api from "../../../lib/axios";
import { useAuth } from "../../../context/AuthContext";
import { useCartCount } from "../../../store/cartCount";
import { useWishlistCount } from "../../../store/wishlistCount";
import { fetchWishlistCount } from "../api/public/wishlist";

export default function HomeLayout() {
    const { isLoggedIn, user } = useAuth();
    const setCartCount = useCartCount((s) => s.set);
    const setWishlistCount = useWishlistCount((s) => s.set);

    useEffect(() => {
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
            console.error("장바구니 개수 불러오기 실패:", e);
            if (alive) setCartCount(0);
          }
        })();
        return () => {
          alive = false;
        };
     }, [isLoggedIn, user?.id, setCartCount]);

  return (
    <div className="relative min-h-screen">
      <Header />
      <main className="w-full h-full overflow-hidden">
        <Outlet />
      </main>
      <Footer isHomepage />
    </div>
  );
}
