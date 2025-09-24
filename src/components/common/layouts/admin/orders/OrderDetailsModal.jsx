import React from "react";
import Modal from "./Modal";
import HeaderBar from "./Modal/HeaderBar";
import MetaCard from "./Modal/MetaCard";
import OrderItems from "./Modal/OrderItems";
import TrackingCard from "./Modal/TrackingCard";
import { usePurchaseOption } from "./Modal/usePurchaseOption";
import CustomerAddressList from "./Modal/CustomerAddressList";

export default function OrderDetailsModal({
  open,
  onClose,
  order,
  onSaveContact,
  onSaveTracking,
  onChangeStatus,
}) {
  const { fallbackRaw } = usePurchaseOption(order);

  if (!order) return null;

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-5xl">
      <div className="p-6 md:p-8">
        {/* 헤더 */}
        <HeaderBar order={order} onChangeStatus={onChangeStatus} />

        {/* 상단 메타 */}
        <MetaCard order={order} />

        {/* 바디 */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* 좌: 고객/배송 정보 */}
          <CustomerAddressList />

          {/* 우: 품목 + 운송장 */}
          <section className="lg:col-span-3 space-y-5">
            <OrderItems order={order} fallbackOptionRaw={fallbackRaw} />
            <TrackingCard order={order} onSaveTracking={onSaveTracking} />
          </section>
        </div>

        {/* 푸터 */}
        <div className="mt-8 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="h-10 rounded-xl px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            닫기
          </button>
        </div>
      </div>
    </Modal>
  );
}
