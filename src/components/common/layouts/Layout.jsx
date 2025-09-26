import React from 'react';
import { useLocation, Outlet } from "react-router-dom";
import Header from "./header/Header";
import HeaderLight from "./header/HeaderLight";
import Footer from "./footer/Footer";
import { useAuth } from '../../../context/AuthContext';

export default function Layout() {
  const { pathname } = useLocation();
  const { isLoggedIn, user } = useAuth();
  const isHomepage = pathname === "/";

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
      <main className="flex-1 pt-24">
        <Outlet />
      </main>
      <Footer isHomepage={isHomepage} />
    </div>
  );
}
