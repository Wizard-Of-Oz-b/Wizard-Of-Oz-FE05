import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetailPage from "./pages/ProductDetailPage";
import Mypage from './pages/Mypage';
import Layout from "./components/common/layouts/Layout";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/mypage" element={<Mypage />} />
      </Route>
    </Routes>
  );
}