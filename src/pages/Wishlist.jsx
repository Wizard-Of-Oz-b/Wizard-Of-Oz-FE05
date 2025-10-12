import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CartDock from "../components/common/layouts/wishlist/components/CartDock";
import Toolbar from "../components/common/layouts/wishlist/components/Toolbar";
import List from "../components/common/layouts/wishlist/components/List";
import StickyActionBar from "../components/common/layouts/wishlist/components/StickyActionBar";
import Toasts from "../components/common/layouts/wishlist/components/Toasts";
import EmptyState from "../components/common/layouts/wishlist/components/EmptyState";
import { useToasts } from "../components/common/layouts/wishlist/hooks/useToasts";
import { useFlyToCart } from "../components/common/layouts/wishlist/hooks/useFlyToCart";
import {
  adaptWishlistItem,
  fetchWishlistCount,
  listWishlist,
  moveWishlistToCart,
  removeWishlist,
} from "../components/common/api/public/wishlist";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import CartLoadingSpin from "../components/features/cart/CartLoadingSpin";
import WishlistCardSkeleton from "../components/common/layouts/wishlist/components/WishlistCardSkeleton";
import { fetchProductStocks } from "../lib/stocks";
import { useCartCount } from "../store/cartCount";
import { useWishlistCount } from "../store/wishlistCount";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, bootstrapping } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [selected, setSelected] = useState(new Set());
  const [cartCount, setCartCount] = useState(0);
  const cartDockRef = useRef(null);
  const imgRefs = useRef({});
  const flyToCart = useFlyToCart(cartDockRef);
  const { inc } = useCartCount();
  const { toasts, pushToast } = useToasts();
  const setWishlistCount = useWishlistCount((s) => s.set);

  const allChecked = selected.size === items.length && items.length > 0;
  const indeterminate = selected.size > 0 && !allChecked;
  const isEmpty = !loading && items.length === 0;
  const isFetchingInitial = loading && items.length === 0;
  const isMutating = loading && items.length > 0;

  // 사용자가 로그인되었는지 확인 -> 아닐경우 로그인페이지로 바로 리다이렉트
  useEffect(() => {
    if (bootstrapping) return;
    if (!isLoggedIn) {
      navigate("/login", { replace: true, state: { from: location.pathname } });
    }
  }, [bootstrapping, isLoggedIn, navigate, location.pathname]);

  // 로그인했을 경우 이동시킴, 에러는 토스트알람으로 확인될 수 있게 설정
  useEffect(() => {
    if (bootstrapping || !isLoggedIn) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const rows = await listWishlist();
        if (!mounted) return;
        setItems(rows.map(adaptWishlistItem));
        setWishlistCount(Array.isArray(rows) ? rows.length : 0);
      } catch (e) {
        console.error(e);
        pushToast("위시리스트를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [bootstrapping, isLoggedIn]);

  const toggleAll = () => {
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(items.map((i) => i.id)));
  };
  const toggleOne = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const onImgRefById = (id, el) => {
    if (el) imgRefs.current[id] = el;
    else delete imgRefs.current[id];
  };

  // 로컬 제거
  const removeOneLocal = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelected((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
  };
  const removeSelectedLocal = () => {
    if (!selected.size) return;
    setItems((prev) => prev.filter((i) => !selected.has(i.id)));
    setSelected(new Set());
  };

  const removeOne = async (id) => {
    const backup = items;
    removeOneLocal(id);
    try {
      setLoading(true);
      await removeWishlist(id);
      pushToast("삭제했어요.");
      setWishlistCount(await fetchWishlistCount());
    } catch (e) {
      console.error(e);
      setItems(backup);
      pushToast("삭제 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  const removeSelected = async () => {
    if (!selected.size) return;
    const ids = [...selected];
    const backup = items;
    removeSelectedLocal();
    try {
      setLoading(true);
      await Promise.all(ids.map((id) => removeWishlist(id)));
      pushToast("선택 항목을 삭제했어요.");
      setWishlistCount(await fetchWishlistCount());
    } catch (e) {
      console.error(e);
      setItems(backup);
      pushToast("일부 항목 삭제에 실패했어요.");
    } finally {
      setLoading(false);
    }
  };

  const addOneToCart = async (id) => {
    try {
      setLoading(true);
      const item = items.find((i) => i.id === id);
      const stockRes = await fetchProductStocks(item.productId);
      const stockMap = stockRes.reduce((acc, s) => {
        acc[s.option_key] = s.stock_quantity;
        return acc;
      }, {});
      if (!stockMap[item.optionKey] || stockMap[item.optionKey] <= 0) {
        setLoading(false);
        requestAnimationFrame(() => {
          pushToast(`"${item.title}" 옵션의 재고가 없어 담을 수 없습니다.\u200B`);
        });
        return;
      }
      await moveWishlistToCart(id, { quantity: 1, remove_from_wishlist: true });
      const img = imgRefs.current[id];
      if (img) flyToCart(img);
      setCartCount((c) => c + 1);
      inc(1);
      pushToast("장바구니에 담겼어요.");
      removeOneLocal(id);
      setWishlistCount(await fetchWishlistCount());
    } catch (e) {
      console.error(e);
      pushToast("장바구니 담기 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  const addSelectedToCart = async () => {
    if (!selected.size) return;
    const ids = [...selected];
    try {
      setLoading(true);
      const stockCache = new Map();
      const ensureStocks = async (productId) => {
        if (!stockCache.has(productId)) {
          const rows = await fetchProductStocks(productId);
          stockCache.set(productId, Array.isArray(rows) ? rows : []);
        }
        return stockCache.get(productId);
      };
      // 재고 있는것만 걸러냄
      const checks = [];
      for (const id of ids) {
        const item = items.find((i) => i.id === id);
        const rows = await ensureStocks(item.productId);
        const hit = rows.find((r) => r.option_key === item.optionKey);
        const ok = (hit?.stock_quantity ?? 0) > 0;
        checks.push({ id, ok, itemTitle: item.title });
      }
      const okIds = checks.filter(c => c.ok).map(c => c.id);
      const noStock = checks.filter(c => !c.ok).map(c => c.itemTitle);

      if (okIds.length === 0) {
        setLoading(false);
        requestAnimationFrame(() => {
          pushToast("선택한 항목 중 담을 수 있는 재고가 없어요.\u200B");
        });
        return;
      }

      const first = okIds[0];
      const firstImg = imgRefs.current[first];
      if (firstImg) flyToCart(firstImg);

      await Promise.all(
        okIds.map((id) =>
          moveWishlistToCart(id, { quantity: 1, remove_from_wishlist: true })
        )
      );

      setCartCount((c) => c + okIds.length);
      inc(okIds.length);
      pushToast(
        noStock.length
          ? `일부 품절로 ${okIds.length}개만 담겼어요.`
          : `선택한 ${okIds.length}개 담겼어요.`
      );
      setItems((prev) => prev.filter((i) => !okIds.includes(i.id)));
      setSelected(new Set());
      setWishlistCount(await fetchWishlistCount());
    } catch (e) {
      console.error(e);
      pushToast("일부 항목 담기에 실패했어요.");
    } finally {
      setLoading(false);
    }
  };
  // 로딩스피너 사용하여 진행중이라는걸 보여주기.
  const showOverlayLoading = bootstrapping || isMutating;

  return (
    <motion.div
      className="min-h-screen text-neutral-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        {/* 헤더 + 카트 */}
        <header className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">위시리스트</h1>
            <p className="mt-1 text-sm text-neutral-500">
              {isFetchingInitial ? "불러오는 중…" : `총 ${items.length}개`}
            </p>
          </div>
          <CartDock ref={cartDockRef} count={cartCount} />
        </header>

        {/* 상단 툴바 */}
        <Toolbar
          allChecked={allChecked}
          indeterminate={indeterminate}
          selectedCount={selected.size}
          totalCount={items.length}
          onToggleAll={toggleAll}
          onRemoveSelected={removeSelected}
          onAddSelected={addSelectedToCart}
        />

        {/* 리스트 / 빈 상태 */}
        {isFetchingInitial ? (
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <WishlistCardSkeleton key={i} />
            ))}
          </ul>
        ) : isEmpty ? (
          <EmptyState />
        ) : (
          <List
            items={items}
            selected={selected}
            onToggleOne={toggleOne}
            onAddOne={addOneToCart}
            onRemoveOne={removeOne}
            onImgRefById={onImgRefById}
          />
        )}
      </div>

      {/* 스티키 바 */}
      <StickyActionBar
        selectedCount={selected.size}
        onClearSelection={() => setSelected(new Set())}
        onRemoveSelected={removeSelected}
        onAddSelected={addSelectedToCart}
      />

      {/* 토스트 */}
      <Toasts toasts={toasts} />
      {showOverlayLoading && (
        <div className="fixed inset-0 z-[8000] flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
          <CartLoadingSpin />
        </div>
      )}
    </motion.div>    
  );
}