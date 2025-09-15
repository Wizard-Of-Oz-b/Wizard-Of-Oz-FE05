import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetailPage from "./pages/ProductDetailPage";

// 에러 컴포넌트
import Error401 from "./pages/errors/Error401";
import Error403 from "./pages/errors/Error403";
import Error404 from "./pages/errors/Error404";
import Error429 from "./pages/errors/Error429";
import Error500 from "./pages/errors/Error500";
import Error502 from "./pages/errors/Error502";
import Error503 from "./pages/errors/Error503";
import Error504 from "./pages/errors/Error504";

// 전역 에러감지
import { ErrorBoundary } from "./components/common/layouts/errors/ErrorBoundary";
import "swiper/css";
import ProductListTest from "./pages/ProductListTest";

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="p-6 text-sm text-gray-500">로딩 중…</div>}>
        <Routes>
          {/* 정상 페이지 */}
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/products" element={<ProductListTest />} />
          {/* 상태코드별 에러 라우트 */}
          <Route path="/errors/401" element={<Error401 />} />
          <Route path="/errors/403" element={<Error403 />} />
          <Route path="/errors/429" element={<Error429 />} />
          <Route path="/errors/500" element={<Error500 />} />
          <Route path="/errors/502" element={<Error502 />} />
          <Route path="/errors/503" element={<Error503 />} />
          <Route path="/errors/504" element={<Error504 />} />
          <Route
            path="*"
            element={
              <Error404
                onSearch={(q) =>
                  (window.location.href = `/search?q=${encodeURIComponent(q)}`)
                }
              />
            }
          />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
