import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetail from "../components/common/product/ProductDetail";
import { ProductDetailCards, ProductSpec } from "../components/common/product/ProductDetailSections";
import { KRW } from "../models/product";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

const MOCK_DB = {
  "E481044-000": {
    id: "E481044-000",
    brand: "B:C",
    name: "블록테크 파카",
    price: 149000,
    rating: 5.0,
    ratingCount: 11,
    colors: [
      { code: "09", name: "Black", hex: "#111111" },
      { code: "39", name: "Dark Brown", hex: "#4b3a33" },
      { code: "57", name: "Olive", hex: "#3a4a3d" },
    ],
    sizes: ["XS","S","M","L","XL"],
    gallery: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1600",
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1600",
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600",
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1600",
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1600",
    ],
    details: [
      { img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200", text: "가벼운 방풍/발수 기능으로 일상과 아웃도어 커버." },
      { img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200", text: "미니멀 실루엣과 실용 포켓." },
      { img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200", text: "레이어드에 좋은 표준 핏." },
    ],
    material: ["겉감: 폴리에스터 100%","안감: 폴리에스터 100%","충전재: 폴리에스터 100%"],
    care: ["세탁기 사용 가능(망 권장)","표백제 금지","건조기 약하게"],
    gender: "men",
    category: "top",
  },
  "M-PANTS-001": {
    id: "M-PANTS-001",
    brand: "B:C",
    name: "테크 슬랙스",
    price: 69000,
    rating: 4.6,
    ratingCount: 83,
    colors: [
      { code: "09", name: "Black", hex: "#111111" },
      { code: "05", name: "Gray", hex: "#4a4a4a" },
    ],
    sizes: ["S","M","L","XL"],
    gallery: [
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600",
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1600",
    ],
    details: [
      { img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200", text: "신축성 좋은 원단으로 활동성 ↑" },
      { img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200", text: "주름 방지 처리로 관리 쉬움" },
    ],
    material: ["폴리에스터 78%","레이온 18%","폴리우레탄 4%"],
    care: ["세탁기 사용 가능","다림질 약하게","건조기 금지"],
    gender: "men",
    category: "bottom",
  },
  "M-SHOES-001": {
    id: "M-SHOES-001",
    brand: "B:C",
    name: "라이트 러너",
    price: 89000,
    rating: 4.2,
    ratingCount: 27,
    colors: [
      { code: "00", name: "White", hex: "#eeeeee" },
      { code: "09", name: "Black", hex: "#111111" },
    ],
    sizes: ["250","260","270","280"],
    gallery: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600",
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1600",
    ],
    details: [
      { img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200", text: "경량 미드솔로 데일리 러닝에 적합" },
      { img: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200", text: "메쉬 어퍼로 통기성 확보" },
    ],
    material: ["합성가죽 / 합성섬유", "러버 아웃솔"],
    care: ["표면 세척 권장","세탁기 금지"],
    gender: "men",
    category: "shoes",
  },
};

// 네트워크 지연 목업 fetch 함수
function fetchProductMock(id, { delay = 400 } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const item = MOCK_DB[id];
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
      if (alive) {
        setError(err.message || "ERROR");
      }
    }
  })();

  return () => { alive = false; };
}, [id]);

  const handleAddToCart = ({ product, color, size, qty }) => {
    // TODO: 장바구니 상태/스토어 연동
    alert(`장바구니: ${product.name} / ${color} / ${size} / ${qty}개 / ${KRW(product.price*qty)}`);
  };

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
