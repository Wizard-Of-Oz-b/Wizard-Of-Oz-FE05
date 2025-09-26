import React, { useEffect, useState } from "react";

export default function CustomerShippingForm({ order, onSaveContact }) {
  const [form, setForm] = useState({ customer: "", phone: "", address: "", note: "" });

  useEffect(() => {
    if (!order) return;
    setForm({
      customer: order.customer || "",
      phone: order.phone || "",
      address: order.address || "",
      note: order.note || "",
    });
  }, [order]);

  return (
    <section className="lg:col-span-2">
      <div className="rounded-2xl border border-gray-100 p-5 bg-white">
        <h4 className="font-semibold mb-4">고객 & 배송 정보</h4>
        <div className="space-y-4">
          {[
            ["고객명", "customer"],
            ["연락처", "phone"],
            ["주소", "address"],
          ].map(([label, key]) => (
            <div key={key}>
              <div className="text-xs text-gray-500 mb-1.5">{label}</div>
              <input
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
              />
            </div>
          ))}
          <div>
            <div className="text-xs text-gray-500 mb-1.5">요청사항</div>
            <textarea
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              className="w-full min-h-[140px] rounded-xl bg-gray-50 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm resize-y"
              placeholder="부재 시 문앞, 경비실 등"
            />
          </div>
          <div className="pt-1">
            <button
              onClick={() => onSaveContact?.(order.id, form)}
              className="h-11 w-full rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
            >
              배송지/연락처 저장
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
