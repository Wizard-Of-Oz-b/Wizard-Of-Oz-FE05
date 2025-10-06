import React, { useEffect, useState, useMemo } from 'react';
import {
  Bell,
  Package2,
  Truck,
  CheckCircle2,
  XCircle,
  Receipt,
  ChevronRight,
} from 'lucide-react';
import RandomProducts from '../../product/RandomProducts';
import { useGetMyAllOrders } from '../../../../hooks/payments/useOrderPayment';

export default function MyPageDashboard() {
  const {
    data: orderPage,
    isLoading: orderLoading,
    isError: orderIsError,
    error: orderError,
  } = useGetMyAllOrders({ page: 1, size: 3 });
  const orders = orderPage?.results ?? [];
  const ordersCount = Number(orderPage?.count || 0);
  const shipments = [];

  const noticeMocks = [
    {
      id: 'n1',
      title: '[점검] 10/13(월) 02:00~03:00 결제 시스템 점검',
      created_at: new Date().toISOString(),
      pinned: true,
    },
    {
      id: 'n2',
      title: '멤버십 10% 추가 할인 쿠폰 지급 안내',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'n3',
      title: '리뷰 이벤트 당첨자 발표',
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ];

  const kpi = useMemo(() => ({
    orders: ordersCount,
    shipping: shipments.length,
    delivered: 0,
    canceled: 0,
  }), [ordersCount, shipments.length]);


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow p-5 flex flex-col items-center">
            <Package2 className="mb-2" size={28} />
            <p className="text-gray-600 text-sm">주문 내역</p>
            <p className="text-2xl font-extrabold">{kpi.orders}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 flex flex-col items-center">
            <Truck className="mb-2" size={28} />
            <p className="text-gray-600 text-sm">배송 중</p>
            <p className="text-2xl font-extrabold">{kpi.shipping}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 flex flex-col items-center">
            <CheckCircle2 className="mb-2" size={28} />
            <p className="text-gray-600 text-sm">배송 완료</p>
            <p className="text-2xl font-extrabold">{kpi.delivered}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 flex flex-col items-center">
            <XCircle className="mb-2" size={28} />
            <p className="text-gray-600 text-sm">취소/반품</p>
            <p className="text-2xl font-extrabold">{kpi.canceled}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* 좌측 메인 */}
          <div className="md:col-span-8 space-y-6">
            {/* 최근 주문 */}
            <section className="bg-white rounded-2xl shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Receipt />
                  <h3 className="font-bold text-gray-900">최근 주문</h3>
                </div>
                <a
                  href="/mypage/orderlist"
                  className="text-sm text-gray-600 hover:underline flex items-center gap-1"
                >
                  전체 보기 <ChevronRight size={16} />
                </a>
              </div>

              {orderLoading ? (
                <p className="text-gray-500">불러오는 중...</p>
              ) : orderIsError ? (
                <p className="text-red-500">
                  {String(orderError?.userMessage || orderError?.message || '주문을 불러오지 못했습니다.')}
                </p>
              ) : orders.length ? (
                <ul className="divide-y divide-gray-200">
                  {orders.map((o) => (
                    <li
                      key={o.purchase_id}
                      className="py-3 flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          주문번호 {o.purchase_id}
                        </p>

                        {/* 상품명만 출력 (요청하신 최소 변경) */}
                        <p className="text-sm text-gray-800 mt-0.5 truncate">
                          {o.product_name || '상품 정보 없음'}
                        </p>

                        <p className="text-sm text-gray-600 mt-0.5">
                          {new Date(o.purchased_at).toLocaleString()} · 상태:{' '}
                          {o.status}
                        </p>

                        {(o.options || o.amount) && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            {o.options ? (
                              <span className="mr-2">
                                옵션:{' '}
                                {typeof o.options === 'object'
                                  ? Object.values(o.options).join(' / ')
                                  : o.options}
                              </span>
                            ) : null}
                            {o.amount ? <span>수량: {o.amount}</span> : null}
                          </p>
                        )}
                      </div>

                      <a
                        href={`/mypage/orders/${o.purchase_id}`}
                        className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50"
                      >
                        상세
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">최근 주문이 없습니다.</p>
              )}
            </section>

            {/* 배송 진행중 */}
            <section className="bg-white rounded-2xl shadow p-5">
              <div className="flex items-center gap-2 mb-3">
                <Truck />
                <h3 className="font-bold text-gray-900">배송 진행중</h3>
              </div>
                <p className="text-gray-500">진행중인 배송이 없습니다.</p>
            </section>

            {/* 공지사항(목업) */}
            <section className="bg-white rounded-2xl shadow p-5">
              <div className="flex items-center gap-2 mb-3">
                <Bell />
                <h3 className="font-bold text-gray-900">공지사항</h3>
              </div>
              <ul className="space-y-2">
                {noticeMocks.map((n) => (
                  <li
                    key={n.id}
                    className="flex justify-between items-center border-b border-gray-200 pb-2"
                  >
                    <span className="text-sm text-gray-800 truncate">
                      {n.pinned ? (
                        <span className="mr-2 px-1.5 py-0.5 text-[10px] rounded bg-gray-900 text-white">
                          공지
                        </span>
                      ) : null}
                      {n.title}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* 추천 상품 섹션 */}
        <RandomProducts limit={8} />
      </div>
    </div>
  );
}
