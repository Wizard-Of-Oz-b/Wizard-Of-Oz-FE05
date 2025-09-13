import React, { useState, useEffect } from "react";
import {
  Shirt,
  PlusCircle,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Pencil,
  Trash2,
} from "lucide-react";
import { ProductHeader, ProductFilter, Switch, IconButton, ProductTable} from "../../components/common/layouts/admin/products";

/* ===== 목업 데이터 ===== */
const mockProducts = [
  {
    id: 1,
    name: "화이트 셔츠",
    sku: "TSHIRT001",
    price: 39000,
    category: "상의",
    image_url: "https://placehold.co/600x400?text=shirts",
    is_available: true,
    created_at: "2025-09-01",
  },
  {
    id: 2,
    name: "슬림 진",
    sku: "JEANS001",
    price: 59000,
    category: "하의",
    image_url: "https://placehold.co/600x400?text=jeans",
    is_available: false,
    created_at: "2025-08-28",
  },
  {
    id: 3,
    name: "블랙 재킷",
    sku: "JACKET001",
    price: 99000,
    category: "아우터",
    image_url: "https://placehold.co/100x80?text=jacket",
    is_available: true,
    created_at: "2025-08-15",
  },
];

export default function ProductAdminPage() {
  const PAGE_SIZE = 5;
  const [products, setProducts] = useState(mockProducts);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filtered = products.filter((p) => {
    const matchCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchQuery = q
      ? p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase())
      : true;
    return matchCategory && matchQuery;
  });

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleAvailable = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_available: !p.is_available } : p))
    );
  };

  const deleteProduct = (id) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    setPage(1);
  }, [q, selectedCategory]);

  return (
    <div className="w-full p-5 mx-auto max-w-8xl">
      <ProductHeader />
      <ProductFilter q={q} setQ={setQ} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <ProductTable pageData={pageData} toggleAvailable={toggleAvailable} deleteProduct={deleteProduct} />

      {/* 페이지네이션 */}
      <div className="mt-6 flex justify-center gap-2">
        <IconButton title="첫 페이지" onClick={() => setPage(1)} disabled={page <= 1}>
          <ChevronsLeft className="size-4" />
        </IconButton>
        <IconButton title="이전" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
          <ChevronLeft className="size-4" />
        </IconButton>
        <span className="px-2 text-sm font-medium">
          <span className="font-semibold text-violet-700">페이지 {page}</span> / {pageCount}
        </span>
        <IconButton title="다음" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page >= pageCount}>
          <ChevronRight className="size-4" />
        </IconButton>
        <IconButton title="마지막" onClick={() => setPage(pageCount)} disabled={page >= pageCount}>
          <ChevronsRight className="size-4" />
        </IconButton>
      </div>
    </div>
  );
}