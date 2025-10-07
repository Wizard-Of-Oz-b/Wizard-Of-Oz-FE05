import React from 'react';
import { useLocation, Outlet } from "react-router-dom";
import Header from "./header/Header";
import HeaderLight from "./header/HeaderLight";
import Footer from "./footer/Footer";
import { useAuth } from '../../../context/AuthContext';
import ScrollToTop from './ScrollToTop';

export default function Layout() {
  const { pathname } = useLocation();
  const { isLoggedIn, user } = useAuth();
  const isHomepage = pathname === "/";
  const noHeaderPad = pathname.startsWith("/mypage"); // 마이페이지일 경우에는 헤더 패딩을 다르게 변경함

  if (isHomepage) {
    return (
      <>
        <Header isLoggedIn={isLoggedIn} user={user} />
        <Outlet />
        <Footer />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLight isLoggedIn={isLoggedIn} user={user} />
      <main className={`flex-1 ${noHeaderPad ? "pt-17" : "pt-24"}`}>
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer isHomepage={isHomepage} />
    </div>
  );
}
