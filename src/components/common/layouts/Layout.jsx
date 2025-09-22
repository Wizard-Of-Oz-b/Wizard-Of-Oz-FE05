import React from 'react';
import { useLocation, Outlet } from "react-router-dom";
import Header from "./header/Header";
import HeaderLight from "./header/HeaderLight";
import Footer from "./footer/Footer";

export default function Layout() {
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      {isHomepage ? <Header /> : <HeaderLight />}
      <main className={`flex-1 ${!isHomepage ? 'pt-24' : ''}`}>
        <Outlet />
      </main>
      <Footer isHomepage={isHomepage} />
    </div>
  );
}