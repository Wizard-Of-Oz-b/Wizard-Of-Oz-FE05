import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import HeaderLight from "./header/HeaderLight";
import Footer from "./footer/Footer";
import { useAuth } from "../../../context/AuthContext";
import ScrollToTop from "./ScrollToTop";

export default function Layout() {
  const { pathname } = useLocation();
  const { isLoggedIn, user } = useAuth();

  const noHeaderPadPages = ["/mypage", "/info", "/login", "/signup", "/brand"];
  const noHeaderPad = noHeaderPadPages.some((p) => pathname.startsWith(p));

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLight isLoggedIn={isLoggedIn} user={user} />
      <main className={`flex-1 ${noHeaderPad ? "pt-17" : "pt-24"}`}>
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
