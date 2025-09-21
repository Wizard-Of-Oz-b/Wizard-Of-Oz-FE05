import React from 'react';
import {
  ShoppingBag, Tag, Boxes, Package, Truck,
  Users, Percent, Bell,
} from 'lucide-react';

export const NAV_SECTIONS = [
  {
    id: 'catalog',
    title: '상품/카탈로그',
    items: [
      { to: '/admin/products',  label: '상품 관리',       icon: <ShoppingBag className="h-4 w-4" /> },
      { to: '/admin/categories',label: '카테고리 관리',   icon: <Tag className="h-4 w-4" /> },
      { to: '/admin/stock',     label: '상품 재고 관리',  icon: <Boxes className="h-4 w-4" /> },
    ],
  },
  {
    id: 'sales',
    title: '주문/배송',
    items: [
      { to: '/admin/orders',    label: '주문 관리',       icon: <Package className="h-4 w-4" /> },
      { to: '/admin/shipment',  label: '고객 배송 관리',  icon: <Truck className="h-4 w-4" /> },
    ],
  },
  {
    id: 'member_marketing',
    title: '회원/마케팅',
    items: [
      { to: '/admin/customers', label: '회원 관리',       icon: <Users className="h-4 w-4" /> },
      { to: '/admin/coupons',   label: '쿠폰/프로모션',   icon: <Percent className="h-4 w-4" /> },
    ],
  },
  {
    id: 'support',
    title: '고객지원',
    items: [
      { to: '/admin/cs',        label: '고객 문의관리',   icon: <Bell className="h-4 w-4" /> },
    ],
  },
];

export const linkClass = ({ isActive }) =>
  `group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition
   ${
     isActive
       ? 'bg-admintheme-violet text-admintheme-white font-semibold shadow-md'
       : 'text-admintheme-white hover:bg-admintheme-violet-dark hover:text-admintheme-white'
   }`;

export const saveOpen = (state) => {
  try { localStorage.setItem('admin_nav_open', JSON.stringify(state)); } catch {}
};
export const loadOpen = () => {
  try { return JSON.parse(localStorage.getItem('admin_nav_open') || '{}'); } catch { return {}; }
};
