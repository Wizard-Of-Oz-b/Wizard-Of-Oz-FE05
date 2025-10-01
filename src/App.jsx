import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "swiper/css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "./pages/Home";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductListTest from "./pages/ProductListTest";
import Wishlist from "./pages/Wishlist";
import ResultTestPage from "./pages/ResultTestPage";
import SignUp from "./pages/SignUp";
import Login from "./pages/login.jsx";
import Mypage from "./pages/Mypage.jsx";
import OAuthCallback from "./pages/OAuthCallback.jsx";

// 에러 컴포넌트
import Error401 from "./pages/errors/Error401";
import Error403 from "./pages/errors/Error403";
import Error404 from "./pages/errors/Error404";
import Error429 from "./pages/errors/Error429";
import Error500 from "./pages/errors/Error500";
import Error502 from "./pages/errors/Error502";
import Error503 from "./pages/errors/Error503";
import Error504 from "./pages/errors/Error504";
import { ErrorBoundary } from "./components/common/layouts/errors/ErrorBoundary";
import Layout from "./components/common/layouts/Layout";

// 어드민
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
import AdminStockPage from "./pages/Admin/AdminStockPage.jsx";
import AdminShipmentsPage from "./pages/Admin/AdminShipmentsPage.jsx";
import UserCart from "./pages/UserCart";
import UserPayment from "./pages/Payments/UserPayment.jsx";
import PaySuccess from "./pages/Payments/PaySuccess.jsx";
import PayFail from "./pages/Payments/PayFail.jsx";
import MemberInfo from "./components/common/layouts/Mypage/MemberInfo.jsx";
import Password from "./components/common/layouts/Mypage/PasswordChange.jsx";
import MemberWithdrawal from "./components/common/layouts/Mypage/MemberWithdrawal.jsx";
import MyReviewsPage from "./components/common/layouts/Mypage/MyReviews.jsx";
import ShippingAddressManager from "./components/common/layouts/Mypage/ShippingAddressManager.jsx";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Suspense fallback={<div className="p-6 text-sm text-gray-500">로딩 중…</div>}>
          <Routes>
            {/* 사용자/공통 레이아웃 */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/products/test" element={<ProductListTest />} />
              <Route path="/cart" element={<UserCart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/results/test" element={<ResultTestPage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/Mypage" element={<Mypage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/payment" element={<UserPayment />} />
              <Route path='/payment/success' element={<PaySuccess />} />
              <Route path='/payment/fail' element={<PayFail />} />

              {/* 마이페이지 (이중 중첩 라우팅) */}
              <Route path="/mypage" element={<Mypage />}>
                {/* <Route path="orderhistory" element={<OrderHistory />} /> */}
                <Route path="memberinfo" element={<MemberInfo />} />
                <Route path="shipping" element={<ShippingAddressManager />} />
                <Route path="password" element={<Password />} />
                <Route path="withdrawal" element={<MemberWithdrawal />} />
                <Route path="reviews" element={<MyReviewsPage />} />
              </Route>
            </Route>
            <Route path="/auth/callback/:provider" element={<OAuthCallback />} />
            <Route path="/oauth/callback/:provider" element={<OAuthCallback />} />

            {/* 인증/접근제어 예외 페이지 */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* 어드민 보호 라우트 */}
            <Route element={<AdminProtectedRoute allowRoles={["super", "manager", "cs"]} />}> 
              <Route path="/admin" element={<AdminLayout />}> 
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ProductAdminPage />} />
                <Route path="orders" element={<OrderAdminPage />} />
                <Route path="customers" element={<MemberAdminPage />} />
                <Route path="categories" element={<CategoryAdminPage />} />
                <Route path="coupons" element={<CouponPromoAdminPage />} />
                <Route path="cs" element={<CustomerSupportAdminPage />} />
                <Route path="stock" element={<AdminStockPage />} />
                <Route path="shipment" element={<AdminShipmentsPage />} />
              </Route>
           </Route>

            {/* 상태코드별 에러 라우트 */}
            <Route path="/errors/401" element={<Error401 />} />
            <Route path="/errors/403" element={<Error403 />} />
            <Route path="/errors/429" element={<Error429 />} />
            <Route path="/errors/500" element={<Error500 />} />
            <Route path="/errors/502" element={<Error502 />} />
            <Route path="/errors/503" element={<Error503 />} />
            <Route path="/errors/504" element={<Error504 />} />

            {/* 404 */}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}