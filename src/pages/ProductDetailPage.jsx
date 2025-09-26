import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from '../components/common/product/ProductDetail';
import { useToasts } from '../components/common/layouts/reviews/hooks/useToasts';
import RandomProducts from '../components/common/product/RandomProducts';
import { useQueryClient } from '@tanstack/react-query';
import { addCartItem } from '../hooks/cart/cartHook';

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
  const { ToastHost, onToast } = useToasts();

  const qc = useQueryClient();

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

  const handleAddToCart = async ({ product, option_key, qty }) => {
    const product_id = product.product_id ?? product.id;
    await addCartItem({ product_id, option_key, quantity: qty ?? 1 });
    onToast('success', `${product.name} 장바구니에 담겼어요.`);
    qc.invalidateQueries({ queryKey: ['userCart'] });
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
      <ProductDetail
        product={product}
        onAddToCart={handleAddToCart}
        onToast={onToast}
      />

      <RandomProducts />

      <ToastHost />

    </div>
  );
}