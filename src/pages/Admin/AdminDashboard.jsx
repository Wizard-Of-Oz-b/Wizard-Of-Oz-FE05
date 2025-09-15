import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  Info,
  Lock,
  Bell,
  ShoppingBag,
  Package,
  TrendingUp,
  Users,
  BarChart2,
} from 'lucide-react';
import { KpiCard, QuickLink, Accordion } from "../../components/features/admin/dashboard";

export default function AdminDashboard() {
  const updates = useMemo(
    () => [
      {
        id: 'u-2025-09-01',
        date: '2025-09-01',
        title: '신규 결제 모듈 연동',
        details:
          '토스·카카오페이 간편결제 기능을 추가하여 결제 전환율을 개선했습니다.',
      },
      {
        id: 'u-2025-08-28',
        date: '2025-08-28',
        title: '상품 관리 기능 개선',
        details:
          '상품 엑셀 일괄 업로드, 카테고리 자동 분류 기능을 추가했습니다.',
      },
      {
        id: 'u-2025-08-20',
        date: '2025-08-20',
        title: '주문/배송 현황 대시보드',
        details:
          '실시간 주문 수, 배송 상태 추적 위젯을 관리자 메인 화면에 추가했습니다.',
      },
    ],
    []
  );

  // 목업데이터
  const salesData = [
    { x: '주1', y: 92 },
    { x: '주2', y: 105 },
    { x: '주3', y: 98 },
    { x: '주4', y: 118 },
    { x: '주5', y: 124 },
    { x: '주6', y: 132 },
    { x: '주7', y: 140 },
  ];

  const ordersData = [
    { x: '0', y: 6 },
    { x: '4', y: 12 },
    { x: '8', y: 34 },
    { x: '12', y: 58 },
    { x: '16', y: 71 },
    { x: '20', y: 49 },
    { x: '24', y: 18 },
  ];

  const membersData = [
    { x: '월', y: 6 },
    { x: '화', y: 8 },
    { x: '수', y: 7 },
    { x: '목', y: 10 },
    { x: '금', y: 12 },
    { x: '토', y: 11 },
    { x: '일', y: 9 },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-admintheme-black via-admintheme-violet-dark to-admintheme-violet px-4 md:px-6 py-8">
      <div className="mx-auto max-w-7xl">
        {/* 헤더 */}
        <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-6">
          <div className="space-y-2">
            {/* 상단 타이틀 */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow tracking-[0.25em] uppercase">
              DASHBOARD
            </h1>

            {/* 안내 문구 */}
            <p className="mt-2 text-sm md:text-base text-gray-200">
              최신 통계와 업데이트 소식을 확인하며 더 스마트하게 운영을
              시작하세요.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-admintheme-violet/40 backdrop-blur-md px-3 py-1 text-white shadow border border-white/10">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-sm font-medium">Admin Access</span>
          </div>
        </header>

        {/* (매출/주문/회원) 출력 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <KpiCard
            icon={
              <TrendingUp className="h-6 w-6 text-admintheme-violet-light" />
            }
            title="이번달 매출"
            value="₩ 120,000,000"
            change="+12%"
            chartType="line"
            data={salesData}
          />
          <KpiCard
            icon={
              <BarChart2 className="h-6 w-6 text-admintheme-violet-light" />
            }
            title="오늘 주문"
            value="342건"
            change="+8%"
            chartType="bar"
            data={ordersData}
          />
          <KpiCard
            icon={<Users className="h-6 w-6 text-admintheme-violet-light" />}
            title="신규 가입자"
            value="54명"
            change="+5%"
            chartType="area"
            data={membersData}
          />
        </section>

        {/* 안내 zone */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 mb-6">
          {/* 운영 안내 */}
          <div className="lg:col-span-2 rounded-2xl bg-admintheme-violet/30 backdrop-blur-md border border-white/10 shadow-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-5 w-5 text-admintheme-violet-light" />
              <h2 className="text-lg font-semibold text-white">운영 안내</h2>
            </div>
            <ul className="space-y-3 text-admintheme-violet-light">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-admintheme-violet text-white text-sm">
                  1
                </span>
                <div>
                  <div className="font-medium text-white">상품 등록</div>
                  <p className="text-sm">
                    신상품을 개별 등록하거나 엑셀 업로드로 한 번에 등록할 수
                    있습니다.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-admintheme-violet text-white text-sm">
                  2
                </span>
                <div>
                  <div className="font-medium text-white">주문 처리</div>
                  <p className="text-sm">
                    주문 접수 → 결제 확인 → 배송 지시 단계를 순차적으로
                    진행합니다.
                  </p>
                </div>
              </li>
            </ul>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-admintheme-violet/40 px-3 py-2 text-white border border-white/10">
              <Info className="h-4 w-4" />
              <span className="text-sm">
                관리자 승인/역할 변경은 고객센터로 문의해주세요.
              </span>
            </div>
          </div>

          {/* QUICK MENU */}
          <div className="rounded-2xl bg-admintheme-violet/30 backdrop-blur-md border border-white/10 shadow-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="h-5 w-5 text-admintheme-violet-light" />
              <h2 className="text-lg font-semibold text-white">QUICN MENU</h2>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <QuickLink
                to="/admin/products"
                icon={
                  <ShoppingBag className="h-4 w-4 text-admintheme-violet-light" />
                }
              >
                상품 등록
              </QuickLink>
              <QuickLink
                to="/admin/orders"
                icon={
                  <Package className="h-4 w-4 text-admintheme-violet-light" />
                }
              >
                주문 관리
              </QuickLink>
              <QuickLink
                to="/admin/cs"
                icon={
                  <Bell className="h-4 w-4 text-admintheme-violet-light" />
                }
              >
                고객 문의
              </QuickLink>
            </div>
          </div>
        </section>

        {/* 업데이트 / 공지 + FAQ */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
          {/* 업데이트 */}
          <div className="lg:col-span-2 rounded-2xl bg-admintheme-violet/30 backdrop-blur-md border border-white/10 shadow-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="h-5 w-5 text-admintheme-violet-light" />
              <h2 className="text-lg font-semibold text-white">
                기능 업데이트
              </h2>
            </div>
            <ul className="divide-y divide-white/10">
              {updates.map((u) => (
                <li key={u.id} className="py-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-admintheme-violet-light" />
                    <div>
                      <div className="text-sm text-admintheme-violet-light">
                        {u.date}
                      </div>
                      <div className="font-medium text-white">{u.title}</div>
                      <p className="text-sm text-admintheme-violet-light">
                        {u.details}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div className="rounded-2xl bg-admintheme-violet/30 backdrop-blur-md border border-white/10 shadow-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-5 w-5 text-admintheme-violet-light" />
              <h2 className="text-lg font-semibold text-white">FAQ</h2>
            </div>
            <Accordion
              items={[
                {
                  q: '상품 등록이 안 돼요.',
                  a: '상품 등록 권한이 있는 관리자만 등록할 수 있습니다. 권한 확인 후 진행해주세요.',
                },
                {
                  q: '배송 상태가 업데이트되지 않아요.',
                  a: '배송사 API와 연동 상태를 확인하고, 문제가 지속되면 고객센터로 문의해주세요.',
                },
                {
                  q: '프로모션 공지는 어디서 확인하나요?',
                  a: '관리자 대시보드의 ‘기능 업데이트’ 섹션에 공지가 올라옵니다.',
                },
              ]}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

