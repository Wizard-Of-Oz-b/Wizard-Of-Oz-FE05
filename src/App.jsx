import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import Layout from "./components/common/layouts/Layout";
import ProductListTest from "./pages/ProductListTest";

const queryClient = new QueryClient()
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLayout from "./components/common/layouts/admin/AdminLayout";
import ProductAdminPage from "./pages/Admin/ProductAdminPage.jsx";
import OrderAdminPage from "./pages/Admin/OrderAdminPage.jsx";
import MemberAdminPage from "./pages/Admin/MemberAdminPage.jsx";
import CategoryAdminPage from "./pages/Admin/CategoryAdminPage.jsx";
import CouponPromoAdminPage from "./pages/Admin/CouponPromoAdminPage.jsx";
import CustomerSupportAdminPage from "./pages/Admin/CustomerSupportAdminPage.jsx";
import AdminProtectedRoute from "./routes/AdminProtectedRoute.jsx";
import AdminLogin from "./pages/Admin/AdminLogin.jsx";
import AdminManagersPage from "./pages/Admin/AdminManagersPage.jsx";

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
            <Route path="/403" element={<Forbidden />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* 어드민 영역 */}
      <Route element={<AdminProtectedRoute allowRoles={["super","manager","cs"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          {/* /admin 진입 시 보여줄 페이지 */}
          <Route index element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ProductAdminPage />} />
          <Route path="/admin/orders" element={<OrderAdminPage />} />
          <Route path="/admin/customers" element={<MemberAdminPage />} />
          <Route path="/admin/categories" element={<CategoryAdminPage />} />
          <Route path="/admin/coupons" element={<CouponPromoAdminPage />} />
          <Route path="/admin/cs" element={<CustomerSupportAdminPage />} />
        </Route>
      </Route>
    </Routes>
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}