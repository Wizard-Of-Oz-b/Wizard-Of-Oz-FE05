import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import ProductDetail from "../components/common/product/ProductDetail";
import {
  ProductDetailCards,
  ProductSpec,
} from "../components/common/product/ProductDetailSections";
import { mockProducts } from "../components/features/admin/products/mockProducts";

function KRW(n) {
  try {
    return n.toLocaleString("ko-KR", { style: "currency", currency: "KRW" });
  } catch {
    return `${n}원`;
  }
}

function buildIndex(products) {
  return products.reduce((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {});
}

export default function ProductDetailPage() {
  const { id: rawId } = useParams();
  const id = decodeURIComponent(rawId || "");

  const PRODUCT_INDEX = useMemo(() => buildIndex(mockProducts), []);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  // 네트워크 지연을 흉내내는 목업 fetch
  function fetchProductMock(productId, { delay = 300 } = {}) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const item = PRODUCT_INDEX[productId];
        if (item) resolve({ data: item });
        else reject(new Error("NOT_FOUND"));
      }, delay);
    });
  }

  useEffect(() => {
    let alive = true;
    setProduct(null);
    setError(null);

    (async () => {
      try {
        const { data } = await fetchProductMock(id);
        if (alive) setProduct(data);
      } catch (err) {
        if (alive) setError(err.message || "ERROR");
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]); // id가 바뀌면 다시 로드

  const handleAddToCart = ({ product, color, size, qty }) => {
    alert(
      `장바구니: ${product.name} / ${color} / ${size} / ${qty}개 / ${KRW(
        product.price * qty
      )}`
    );
  };

  if (error === "NOT_FOUND") {
    return (
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-sm text-gray-500">
          해당 상품(ID: <span className="font-mono">{id}</span>)을 찾을 수
          없습니다.
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-96 bg-gray-100 rounded" />
          <div className="lg:col-span-4 space-y-4">
            <div className="h-6 bg-gray-100 rounded" />
            <div className="h-6 bg-gray-100 rounded w-1/2" />
            <div className="h-10 bg-gray-100 rounded" />
            <div className="h-24 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
      <ProductDetail product={product} onAddToCart={handleAddToCart} />

      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-4">제품 상세 설명</h2>
        <ProductDetailCards details={product.details} />
        <ProductSpec material={product.material} care={product.care} />
      </section>
    </div>
  );
}
