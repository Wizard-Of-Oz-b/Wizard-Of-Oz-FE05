import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetailPage from "./pages/ProductDetailPage";
import "swiper/css";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLayout from "./components/common/layouts/admin/AdminLayout";
import ProductAdminPage from "./pages/Admin/ProductAdminPage.jsx";
import OrderAdminPage from "./pages/Admin/OrderAdminPage.jsx";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />

      {/* 어드민 영역 */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* /admin 진입 시 보여줄 페이지 */}
        <Route index element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ProductAdminPage />} />
        <Route path="/admin/orders" element={<OrderAdminPage />} />
      </Route>
    </Routes>
  );
}
