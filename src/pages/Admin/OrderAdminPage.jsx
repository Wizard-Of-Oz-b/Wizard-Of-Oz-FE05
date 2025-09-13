import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

import mockOrders from "../../components/features/admin/orders/mockOrders";
import { ORDER_STATUS } from "../../components/features/admin/orders/constants";
import {
  IconButton,
  StatusBadge,
  StatusChangeModal,
  RequestDecisionModal,
  OrderDetailsModal,
} from "../../components/common/layouts/admin/orders";
import { getNextStatus } from "../../components/features/admin/orders/orderStatus";

export default function OrderAdminPage() {
  const PAGE_SIZE = 10;
  const [orders, setOrders] = useState(mockOrders);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // 모달 상태
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusTargetId, setStatusTargetId] = useState(null);

  // 파생값: 항상 최신 order를 찾아옴
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || null;
  const statusTarget = orders.find((o) => o.id === statusTargetId) || null;

  // 검색 & 필터
  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter ? o.status === statusFilter : true;
    const matchQuery = q
      ? o.orderNo.toLowerCase().includes(q.toLowerCase()) ||
        o.customer.toLowerCase().includes(q.toLowerCase())
      : true;
    return matchStatus && matchQuery;
  });

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goFirst = () => setPage(1);
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(pageCount, p + 1));
  const goLast = () => setPage(pageCount);

  useEffect(() => setPage(1), [q, statusFilter]);

  // 업데이트 핸들러
  const saveContact = (orderId, partial) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...partial } : o))
    );
  };

  const saveTracking = (orderId, { carrier, trackingNo }) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              carrier: carrier.trim(),
              trackingNo: trackingNo.trim(),
              status: getNextStatus(o.status, carrier, trackingNo),
            }
          : o
      )
    );
  };

  const onChangeStatus = (orderId, next) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: next } : o))
    );
  };

  const approveRequest = (adminNote = "") => {
    if (!selectedOrder || !selectedOrder.request) return;
    const isCancel = selectedOrder.request.type === "cancel";
    const newStatus = isCancel ? "취소완료" : "환불완료";
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id
          ? {
              ...o,
              status: newStatus,
              request: null,
              adminNote: adminNote.trim(),
            }
          : o
      )
    );
    setRequestOpen(false);
  };

  const rejectRequest = (adminNote = "") => {
    if (!selectedOrder) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id
          ? { ...o, request: null, adminNote: adminNote.trim() }
          : o
      )
    );
    setRequestOpen(false);
  };

  return (
    <div className="w-full p-5 mx-auto max-w-8xl">
      {/* 헤더 */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg">
            <ShoppingCart className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-violet-700 tracking-tight">
              주문 관리
            </h1>
            <p className="text-sm uppercase tracking-widest text-gray-400">
              Order Management
            </p>
          </div>
        </div>
      </div>

      {/* 필터 */}
      <div className="mb-6 flex flex-col md:flex-row gap-3 items-center justify-between rounded-2xl bg-white/90 shadow-md backdrop-blur-md p-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 min-w-40 rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
        >
          <option value="">상태: 전체</option>
          {ORDER_STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="주문번호 또는 고객명을 입력해주세요."
          className="h-10 rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 w-full md:max-w-xs border-0 shadow-sm"
        />
      </div>

      {/* 테이블 */}
      <div className="relative overflow-x-auto rounded-2xl shadow-lg bg-white">
        <table className="min-w-[980px] w-full">
          <thead className="bg-gradient-to-r from-violet-600 to-violet-700 text-white text-left text-xs font-semibold uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 rounded-tl-2xl">주문번호</th>
              <th className="px-4 py-3">고객명</th>
              <th className="px-4 py-3">대표 상품</th>
              <th className="px-4 py-3 text-right">금액</th>
              <th className="px-4 py-3 text-center">상태</th>
              <th className="px-4 py-3 text-center">요청</th>
              <th className="px-4 py-3 text-center">주문일</th>
              <th className="px-4 py-3 text-center rounded-tr-2xl">기능</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-gray-500">
                  주문이 없습니다.
                </td>
              </tr>
            ) : (
              pageData.map((o) => (
                <tr
                  key={o.id}
                  className="hover:bg-violet-50/40 transition-colors"
                >
                  <td className="px-4 py-4 font-semibold text-gray-800">
                    <button
                      onClick={() => {
                        setSelectedOrderId(o.id);
                        setDetailOpen(true);
                      }}
                      className="underline decoration-violet-300 underline-offset-2 hover:text-violet-700"
                    >
                      {o.orderNo}
                    </button>
                  </td>
                  <td className="px-4 py-4">{o.customer}</td>
                  <td className="px-4 py-4 truncate">
                    {o.items?.[0]?.name}
                    {o.items && o.items.length > 1 && (
                      <span className="text-xs text-gray-500">
                        {" "}
                        외 {o.items.length - 1}건
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-violet-700">
                    {o.amount.toLocaleString()}원
                  </td>
                  <td className="px-4 py-4 text-center">
                    <StatusBadge
                      status={o.status}
                      onClick={() => {
                        setStatusTargetId(o.id);
                        setStatusOpen(true);
                      }}
                    />
                  </td>
                  <td className="px-4 py-4 text-center">
                    {o.request ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {o.request.type === "cancel" ? "취소요청" : "환불요청"}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center text-gray-600">
                    {o.created_at}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {o.request && !["취소완료", "환불완료"].includes(o.status) ? (
                      <button
                        onClick={() => {
                          setSelectedOrderId(o.id);
                          setRequestOpen(true);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-200"
                      >
                        {o.request.type === "cancel"
                          ? "취소요청 처리"
                          : "환불요청 처리"}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="mt-6 flex justify-center gap-2">
        <IconButton title="첫 페이지" onClick={goFirst} disabled={page <= 1}>
          <ChevronsLeft className="size-4" />
        </IconButton>
        <IconButton title="이전" onClick={goPrev} disabled={page <= 1}>
          <ChevronLeft className="size-4" />
        </IconButton>
        <span className="px-2 text-sm font-medium">
          <span className="font-semibold text-violet-700">페이지 {page}</span> /{" "}
          {pageCount}
        </span>
        <IconButton
          title="다음"
          onClick={goNext}
          disabled={page >= pageCount}
        >
          <ChevronRight className="size-4" />
        </IconButton>
        <IconButton
          title="마지막"
          onClick={goLast}
          disabled={page >= pageCount}
        >
          <ChevronsRight className="size-4" />
        </IconButton>
      </div>

      {/* 상세 모달 */}
      <OrderDetailsModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        order={selectedOrder}
        onSaveContact={saveContact}
        onSaveTracking={saveTracking}
        onOpenRequestModal={() => setRequestOpen(true)}
        onChangeStatus={onChangeStatus}
      />

      {/* 요청 처리 모달 */}
      <RequestDecisionModal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        order={selectedOrder}
        onApprove={(note) => approveRequest(note)}
        onReject={(note) => rejectRequest(note)}
      />

      {/* 상태 변경 모달 */}
      <StatusChangeModal
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        order={statusTarget}
        onConfirm={(next) => {
          if (statusTarget) onChangeStatus(statusTarget.id, next);
          setStatusOpen(false);
        }}
      />
    </div>
  );
}
