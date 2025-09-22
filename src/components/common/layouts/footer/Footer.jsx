import React from "react";

export default function Footer({ isHomepage }) {
  const footerClass = `bg-gray-100 ${!isHomepage ? 'mt-6' : ''}`;

  return (
    <footer className={footerClass}>
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between text-sm text-gray-600">
        <p>© 2025 MyShop. All rights reserved.</p>
        <nav className="flex gap-4 mt-2 md:mt-0">
          <a href="#">고객센터</a>
          <a href="#">이용약관</a>
          <a href="#">개인정보처리방침</a>
        </nav>
      </div>
    </footer>
  );
}