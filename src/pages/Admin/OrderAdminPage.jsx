import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import {
  ShoppingCart,
} from 'lucide-react';
import {
  OrderTable,
  StatusChangeModal,
  RequestDecisionModal,
  OrderDetailsModal,
  Pagination,
} from '../../components/common/layouts/admin/orders';
import {
  fetchAdminOrders,
  fetchOrderItems,
  cancelAdminOrder,
  refundAdminOrder,
} from '../../components/common/api/admin/adminOrders';
import {
  adaptAdminOrderHeader,
  adaptOrderItems,
  mapStatusToKorean,
} from '../../components/common/api/admin/adminOrders.adapters';
import OrderFilters from '../../components/common/layouts/admin/orders/OrderFilters';
import ExportExcelButton from '../../components/common/layouts/admin/orders/ExportExcelButton';
import Toast from '../../components/common/layouts/admin/common/Toast';
import { getShipment, normalizeShipmentStatus } from '../../components/common/api/common/shipments';

function toStartOfDayISO(ymd) {
  if (!ymd) return undefined;
  return dayjs(ymd).startOf('day').toDate().toISOString();
}
function toEndOfDayISO(ymd) {
  if (!ymd) return undefined;
  return dayjs(ymd).endOf('day').toDate().toISOString();
}

export default function OrderAdminPage() {
  const PAGE_SIZE = 10;

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [total, setTotal] = useState(0);

  // 날짜 필터
  const [startDate, setStartDate] = useState(''); 
  const [endDate, setEndDate] = useState('');

  // 모달 상태
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusTargetId, setStatusTargetId] = useState(null);

  // 토스트 
  const [toasts, setToasts] = useState([]);
  const toastSeq = useRef(0);
  const pushToast = (message, { type = 'info', description, duration = 2600 } = {}) => {
    const id = ++toastSeq.current;
    setToasts((prev) => [...prev, { id, message, type, description }]);
    if (duration > 0) setTimeout(() => removeToast(id), duration);
  };
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || null;
  const statusTarget = orders.find((o) => o.id === statusTargetId) || null;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // 페이지 이동
  const goFirst = () => setPage(1);
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(pageCount, p + 1));
  const goLast = () => setPage(pageCount);

  // 날짜 빠른 선택
  const setToday = () => {
    const ymd = dayjs().format('YYYY-MM-DD');
    setStartDate(ymd);
    setEndDate(ymd);
  };
  const setThisWeek = () => {
    const start = dayjs().startOf('week').add(1, 'day');
    const end = start.add(6, 'day');
    setStartDate(start.format('YYYY-MM-DD'));
    setEndDate(end.format('YYYY-MM-DD'));
  };
  const setThisMonth = () => {
    setStartDate(dayjs().startOf('month').format('YYYY-MM-DD'));
    setEndDate(dayjs().endOf('month').format('YYYY-MM-DD'));
  };
  const clearRange = () => {
    setStartDate('');
    setEndDate('');
  };

  useEffect(() => setPage(1), [q, statusFilter, startDate, endDate]);

  useEffect(() => {
  let alive = true;
  (async () => {
    try {
      const params = {
        page,
        size: PAGE_SIZE,
        search: q || undefined,
        status: statusFilter || undefined,
        ordering: '-purchased_at',
        created_from: toStartOfDayISO(startDate),
        created_to: toEndOfDayISO(endDate),
      };

      const list = await fetchAdminOrders(params);
      const headers = (list.results || []).map(adaptAdminOrderHeader);

      const withItems = await Promise.all(
        headers.map(async (h) => {
          const itemsResp = await fetchOrderItems(h.id, { size: 50 });
          const items = adaptOrderItems(itemsResp.results || itemsResp || []);
          return { ...h, items };
        })
      );

      if (!alive) return;

      try {
        const map = JSON.parse(localStorage.getItem('shipmentByPurchase') || '{}');
        withItems.forEach((o) => {
          const key = String(o.id ?? o.purchase_id);
          const m = map[key];
          if (m?.shipmentId) {
            o.shipmentId = m.shipmentId;
            o.shipment = {
              ...(o.shipment || {}),
              id: m.shipmentId,
              carrier: m.carrier || o.shipment?.carrier,
              tracking_number: m.trackingNo || o.shipment?.tracking_number,
              status: m.status || o.shipment?.status,
              last_synced_at: m.last_synced_at || o.shipment?.last_synced_at,
            };
            o.carrier = m.carrier || o.carrier;
            o.trackingNo = m.trackingNo || o.trackingNo;
          }
        });
      } catch (e) {
        console.warn('localStorage merge failed', e);
      }

      try {
        const shipmentIds = Array.from(
          new Set(withItems.map(o => o.shipmentId).filter(Boolean))
        );
        if (shipmentIds.length) {
          const resArr = await Promise.all(
            shipmentIds.map((id) => getShipment(id).catch(() => null))
          );
          const shipMap = {};
          resArr.forEach((s) => { if (s && s.id) shipMap[s.id] = s; });

          withItems.forEach((o) => {
            const sid = o.shipmentId;
            const s = shipMap[sid];
            if (s) {
              o.shipment = {
                ...(o.shipment || {}),
                id: s.id,
                status: s.status ?? o.shipment?.status,
                tracking_number: s.tracking_number ?? o.shipment?.tracking_number,
                carrier: s.carrier ?? o.shipment?.carrier,
                last_synced_at: s.last_synced_at ?? o.shipment?.last_synced_at,
                last_event_status: s.last_event_status ?? o.shipment?.last_event_status,
                last_event_loc: s.last_event_loc ?? o.shipment?.last_event_loc,
                last_event_desc: s.last_event_desc ?? o.shipment?.last_event_desc,
              };
              o.carrier = o.carrier || o.shipment.carrier;
              o.trackingNo = o.trackingNo || o.shipment.tracking_number;
            }
          });
        }
      } catch (e) {
        console.warn('hydrate shipments failed', e);
      }

      setOrders(withItems);
      setTotal(list.count || withItems.length);
    } catch (e) {
      if (!alive) return;
      setOrders([]);
      setTotal(0);
      console.error('fetch admin orders failed', e);
      pushToast('주문 목록을 가져오지 못했습니다.', {
        type: 'error',
        description: '네트워크 상태를 확인하고 다시 시도해주세요.',
      });
    }
  })();
  return () => {
    alive = false;
  };
}, [page, PAGE_SIZE, q, statusFilter, startDate, endDate]);

  // 편집(주소/연락처/메모)
  const saveContact = (orderId, partial) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...partial } : o)));
    pushToast('배송지/연락처가 저장되었습니다.', { type: 'success' });
  };

  const saveTracking = (orderId, payload) => {
    if (payload?.__error) {
      pushToast(payload.message || "운송장 등록에 실패했습니다. 잠시 후 다시 시도해주세요.", { type: "error" });
      return;
    }

  const { carrier, trackingNo, shipmentId, status, last_synced_at } = payload || {};

  setOrders((prev) =>
    prev.map((o) =>
      o.id === orderId
        ? {
            ...o,
            carrier: carrier?.trim() ?? o.carrier,
            trackingNo: trackingNo?.trim() ?? o.trackingNo,
            shipmentId: shipmentId ?? o.shipmentId,
            shipment: {
              ...(o.shipment || {}),
              id: shipmentId ?? o.shipment?.id,
              status: normalizeShipmentStatus(status) || o.shipment?.status,
              last_synced_at: last_synced_at ?? o.shipment?.last_synced_at,
              carrier: carrier?.trim() ?? o.shipment?.carrier,
              tracking_number: trackingNo?.trim() ?? o.shipment?.tracking_number,
            },
          }
        : o
      )
    );

    try {
      const map = JSON.parse(localStorage.getItem("shipmentByPurchase") || "{}");
      const key = String(orderId);
      map[key] = {
        shipmentId,
        carrier: carrier?.trim() || "",
        trackingNo: trackingNo?.trim() || "",
        status: normalizeShipmentStatus(status) || "",
        last_synced_at: last_synced_at || "",
      };
      localStorage.setItem("shipmentByPurchase", JSON.stringify(map));
    } catch {}

    pushToast("운송장 정보가 저장되었습니다.", { type: "success" });
  };

  // 상태 변경
  const onChangeStatus = async (orderId, nextKor) => {
    try {
      if (nextKor === '취소완료') {
        const items = (orders.find((o) => o.id === orderId)?.items) || [];
        const resp = await cancelAdminOrder(orderId, items);
        const next = mapStatusToKorean(resp?.status) || '취소완료';
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: next, request: null } : o))
        );
        pushToast('주문이 취소 처리되었습니다.', { type: 'success' });
        return;
      }
      if (nextKor === '환불완료') {
        const items = (orders.find((o) => o.id === orderId)?.items) || [];
        const resp = await refundAdminOrder(orderId, items);
        const next = mapStatusToKorean(resp?.status) || '환불완료';
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: next, request: null } : o))
        );
        pushToast('주문이 환불 처리되었습니다.', { type: 'success' });
        return;
      }
      pushToast('아직 지원되지 않는 상태 변경입니다.', {
        type: 'info',
        description: '관리자 콘솔 업데이트 후 이용해주세요.',
      });
    } catch (e) {
      console.error('onChangeStatus failed', e);
      pushToast('상태 변경에 실패했습니다.', {
        type: 'error',
        description: '잠시 후 다시 시도해주세요.',
      });
    }
  };

  // 요청 처리(승인 → 취소완료/환불완료)
  const approveRequest = async (adminNote = '') => {
    if (!selectedOrder || !selectedOrder.request) return;
    const isCancel = selectedOrder.request.type === 'cancel';
    try {
      if (isCancel) {
        const resp = await cancelAdminOrder(selectedOrder.id, selectedOrder.items || []);
        const next = mapStatusToKorean(resp?.status) || '취소완료';
        setOrders((prev) =>
          prev.map((o) =>
            o.id === selectedOrder.id ? { ...o, status: next, request: null, adminNote } : o
          )
        );
        pushToast('취소 요청이 승인되었습니다.', { type: 'success' });
      } else {
        const resp = await refundAdminOrder(selectedOrder.id, selectedOrder.items || []);
        const next = mapStatusToKorean(resp?.status) || '환불완료';
        setOrders((prev) =>
          prev.map((o) =>
            o.id === selectedOrder.id ? { ...o, status: next, request: null, adminNote } : o
          )
        );
        pushToast('환불 요청이 승인되었습니다.', { type: 'success' });
      }
    } catch (e) {
      console.error('approve failed', e);
      pushToast('요청 처리에 실패했습니다.', {
        type: 'error',
        description: '다시 시도해주세요.',
      });
    } finally {
      setRequestOpen(false);
    }
  };

  const rejectRequest = (adminNote = '') => {
    if (!selectedOrder) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id ? { ...o, request: null, adminNote: adminNote.trim() } : o
      )
    );
    setRequestOpen(false);
    pushToast('요청이 반려되었습니다.', { type: 'success' });
  };

  const pageData = orders;

  return (
    <div className="w-full p-5 mx-auto max-w-8xl">
      {/* 헤더 */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg">
            <ShoppingCart className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-violet-700 tracking-tight">주문 관리</h1>
            <p className="text-sm uppercase tracking-widest text-gray-400">Order Management</p>
          </div>
        </div>

        {/* 엑셀 다운로드 버튼 */}
        <div className="flex items-center gap-2">
          <ExportExcelButton
            orders={pageData}
            startDate={startDate}
            endDate={endDate}
            page={page}
            filenamePrefix="Orders"
          />
        </div>
      </div>

      {/* 필터 (검색/상태/날짜) */}
      <OrderFilters
        q={q}
        setQ={setQ}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setToday={setToday}
        setThisWeek={setThisWeek}
        setThisMonth={setThisMonth}
        clearRange={clearRange}
      />

      {/* 테이블 */}
      <OrderTable
        orders={pageData}
        onOpenDetails={(id) => {
          setSelectedOrderId(id);
          setDetailOpen(true);
        }}
        onOpenRequest={(id) => {
          setSelectedOrderId(id);
          setRequestOpen(true);
        }}
        onOpenStatus={(id) => {
          setStatusTargetId(id);
          setStatusOpen(true);
        }}
      />

      {/* 페이지네이션 */}
      <Pagination
        page={page}
        pageCount={pageCount}
        onFirst={goFirst}
        onPrev={goPrev}
        onNext={goNext}
        onLast={goLast}
      />

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

      {/* 토스트 알림 */}
      <Toast list={toasts} remove={removeToast} />
    </div>
  );
}
