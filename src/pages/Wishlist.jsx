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
  listWishlist,
  moveWishlistToCart,
  removeWishlist,
} from "../components/common/api/public/wishlist";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(new Set());
  const [cartCount, setCartCount] = useState(0);
  const cartDockRef = useRef(null);
  const imgRefs = useRef({});
  const flyToCart = useFlyToCart(cartDockRef);

  const { toasts, pushToast } = useToasts();

  const allChecked = selected.size === items.length && items.length > 0;
  const indeterminate = selected.size > 0 && !allChecked;
  const isEmpty = !loading && items.length === 0;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const rows = await listWishlist();
        if (!mounted) return;
        setItems(rows.map(adaptWishlistItem));
      } catch (e) {
        console.error(e);
        pushToast("위시리스트를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
      await removeWishlist(id);
      pushToast("삭제했어요.");
    } catch (e) {
      console.error(e);
      setItems(backup);
      pushToast("삭제 중 오류가 발생했어요.");
    }
  };

  const removeSelected = async () => {
    if (!selected.size) return;
    const ids = [...selected];
    const backup = items;
    removeSelectedLocal();
    try {
      await Promise.all(ids.map((id) => removeWishlist(id)));
      pushToast("선택 항목을 삭제했어요.");
    } catch (e) {
      console.error(e);
      setItems(backup);
      pushToast("일부 항목 삭제에 실패했어요.");
    }
  };

  const addOneToCart = async (id) => {
    try {
      await moveWishlistToCart(id, { quantity: 1, remove_from_wishlist: true });
      const img = imgRefs.current[id];
      if (img) flyToCart(img);
      setCartCount((c) => c + 1);
      pushToast("장바구니에 담겼어요.");
      removeOneLocal(id);
    } catch (e) {
      console.error(e);
      pushToast("장바구니 담기 중 오류가 발생했어요.");
    }
  };

  const addSelectedToCart = async () => {
    if (!selected.size) return;
    const ids = [...selected];
    try {
      const first = ids[0];
      const firstImg = imgRefs.current[first];
      if (firstImg) flyToCart(firstImg);

      await Promise.all(
        ids.map((id) =>
          moveWishlistToCart(id, { quantity: 1, remove_from_wishlist: true })
        )
      );

      setCartCount((c) => c + ids.length);
      pushToast(`선택한 ${ids.length}개 담겼어요.`);
      setItems((prev) => prev.filter((i) => !selected.has(i.id)));
      setSelected(new Set());
    } catch (e) {
      console.error(e);
      pushToast("일부 항목 담기에 실패했어요.");
    }
  };

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
              {loading ? "불러오는 중…" : `총 ${items.length}개`}
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
        {isEmpty ? (
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
    </motion.div>
  );
}