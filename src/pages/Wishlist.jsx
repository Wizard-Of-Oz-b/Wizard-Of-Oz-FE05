import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import CartDock from "../components/common/layouts/wishlist/components/CartDock";
import Toolbar from "../components/common/layouts/wishlist/components/Toolbar";
import List from "../components/common/layouts/wishlist/components/List";
import StickyActionBar from "../components/common/layouts/wishlist/components/StickyActionBar";
import Toasts from "../components/common/layouts/wishlist/components/Toasts";
import EmptyState from "../components/common/layouts/wishlist/components/EmptyState";
import { useToasts } from "../components/common/layouts/wishlist/hooks/useToasts";
import { useFlyToCart } from "../components/common/layouts/wishlist/hooks/useFlyToCart";

//목업데이터
const initialItems = [
  { id: "1", title: "[오버핏 셔츠] 바이오워싱, SKY BLUE", image: "https://placehold.co/120x150?text=IMG", options: "옵션: FREE", price: 35900 },
  { id: "2", title: "코튼 베이직 티셔츠, WHITE", image: "https://placehold.co/120x150?text=IMG", options: "옵션: M",    price: 15900 },
];

export default function Wishlist() {
  const [items, setItems] = useState(initialItems);
  const [selected, setSelected] = useState(new Set());
  const [cartCount, setCartCount] = useState(0);

  const cartDockRef = useRef(null);
  const imgRefs = useRef({});
  const flyToCart = useFlyToCart(cartDockRef);

  const { toasts, pushToast } = useToasts();

  const allChecked = selected.size === items.length && items.length > 0;
  const indeterminate = selected.size > 0 && !allChecked;
  const isEmpty = items.length === 0;

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

  const removeSelected = () => {
    if (!selected.size) return;
    setItems((prev) => prev.filter((i) => !selected.has(i.id)));
    setSelected(new Set());
  };

  const removeOne = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelected((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
  };

  const addOneToCart = (id) => {
    const img = imgRefs.current[id];
    flyToCart(img);
    setCartCount((c) => c + 1);
    pushToast("장바구니에 담겼어요.");
    // TODO: await api.cart.add(id)
    removeOne(id);
  };

  const addSelectedToCart = () => {
    if (!selected.size) return;
    const first = [...selected][0];
    flyToCart(imgRefs.current[first]);
    setCartCount((c) => c + selected.size);
    pushToast(`선택한 ${selected.size}개 담겼어요.`);
    // TODO: await api.cart.add([...selected])
    setItems((prev) => prev.filter((i) => !selected.has(i.id)));
    setSelected(new Set());
  };

  return (
    <motion.div className="min-h-screen bg-neutral-50 text-neutral-900" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }}>
      <div className="mx-auto w-full max-w-7xl px-6 py-16 mt-8">
        {/* 헤더 + 카트 */}
        <header className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">위시리스트</h1>
            <p className="mt-1 text-sm text-neutral-500">총 {items.length}개</p>
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

      {/* 선택 스티키 바 */}
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
