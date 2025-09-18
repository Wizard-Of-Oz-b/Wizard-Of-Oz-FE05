import React from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import ProductDetailPage from "./pages/ProductDetailPage";
import "swiper/css";
import Mypage from './pages/Mypage';
import Layout from "./components/common/layouts/Layout";
import ProductListTest from "./pages/ProductListTest";

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Suspense fallback={<div className="p-6 text-sm text-gray-500">로딩 중…</div>}>
          <Routes>
            {/* 레이아웃이 필요한 페이지 */}
         <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/products/test" element={<ProductListTest />} />
           </Route>

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
    </QueryClientProvider>
  );
}