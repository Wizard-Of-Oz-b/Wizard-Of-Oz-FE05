import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetailPage from "./pages/ProductDetailPage";
import "swiper/css";
import Mypage from './pages/Mypage';
import Layout from "./components/common/layouts/Layout";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/mypage" element={<Mypage />} />
      </Routes>
    </Layout>
  );
}