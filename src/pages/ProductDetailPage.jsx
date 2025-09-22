import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from '../components/common/product/ProductDetail';

const API_BASE = (
  import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api/v1'
).trim();

function KRW(n) {
  try {
    return n.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
  } catch {
    return `${n}원`;
  }
}

export default function ProductDetailPage() {
  const { id: rawId } = useParams();
  const id = decodeURIComponent(rawId || '');

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setProduct(null);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/v1/products/${id}/`);
        if (!res.ok) throw new Error('NOT_FOUND');
        const data = await res.json();

        const mapped = {
          ...data,
          gallery: [
            data.primary_image?.url,
            ...(data.images?.map((img) => img.url).filter(Boolean) || []),
          ].filter(Boolean),
          colors:
            (data.options || [])
              .find((o) => o.id === 'OPT_COLOR')
              ?.values.map((v) => ({
                code: v.value,
                name: v.display,
                hex: v.hexCode,
              })) || [],
          sizes:
            (data.options || [])
              .find((o) => o.id === 'OPT_SIZE')
              ?.values.map((v) => v.display) || [],
          price: Number(data.price || 0),
        };

        if (alive) setProduct(mapped);
      } catch (err) {
        if (alive) setError(err.message || 'ERROR');
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  if (error === 'NOT_FOUND') {
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

  const handleAddToCart = ({ product, color, size, qty }) => {
    alert(
      `장바구니: ${product.name} / ${color} / ${size} / ${qty}개 / ${KRW(
        product.price * qty
      )}`
    );
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
      <ProductDetail product={product} onAddToCart={handleAddToCart} />

      <section className="my-12 bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-lg p-10 border border-gray-100 relative overflow-hidden">
        {/* 배경 포인트 장식 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
          <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        </div>

        <div className="relative">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b-2 border-slate-700 inline-block">
            제품 상세 설명
          </h2>

          {/* 설명 텍스트 */}
          <p className="text-gray-700 leading-relaxed text-lg mb-6">
            {product.description || '이 상품에 대한 설명이 준비되어 있습니다.'}
          </p>

          {/* 혜택/포인트 강조 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
            <p className="text-xl font-semibold text-slate-800 mb-2">
              ✨ 고급스러움과 품격을 담은 아이템 ✨
            </p>
            <p className="text-gray-600">
              세련된 디자인과 완벽한 착용감.
              <span className="text-slate-700 font-bold"> 클래식 무드</span>로
              오래도록 함께할 수 있습니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
