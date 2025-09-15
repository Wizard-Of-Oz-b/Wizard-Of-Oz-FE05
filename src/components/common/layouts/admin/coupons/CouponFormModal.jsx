import Modal from "../common/Modal";
import IconButton from "../common/IconButton";
import { useState, useEffect } from "react";
import Switch from "../common/Switch";
import { Gift, ShieldCheck } from "lucide-react";

export default function CouponFormModal({ open, onClose, coupon, onSave }) {
  const isEdit = !!coupon;
  const [form, setForm] = useState({
    code: "",
    name: "",
    type: "percent",
    value: 10,
    minOrder: 0,
    usageLimit: 0,
    startDate: "",
    endDate: "",
    active: true,
  });

  useEffect(() => {
    if (coupon) {
      setForm({
        code: coupon.code || "",
        name: coupon.name || "",
        type: coupon.type || "percent",
        value: coupon.value ?? 0,
        minOrder: coupon.minOrder ?? 0,
        usageLimit: coupon.usageLimit ?? 0,
        startDate: coupon.startDate || "",
        endDate: coupon.endDate || "",
        active: !!coupon.active,
      });
    } else {
      setForm((f) => ({ ...f, code: genCode() }));
    }
  }, [coupon]);

  const onChange = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const genCode = () => {
    const seed = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `PROMO-${seed}`;
  };

  const submit = () => {
    const payload = {
      id: coupon?.id ?? Date.now(),
      ...form,
      value: Number(form.value) || 0,
      minOrder: Number(form.minOrder) || 0,
      usageLimit: Number(form.usageLimit) || 0,
    };
    onSave(payload);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-3xl">
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Gift className="size-5" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold">{isEdit ? "쿠폰/프로모션 수정" : "새 쿠폰/프로모션"}</h3>
            <p className="text-sm text-gray-500">코드/기간/조건을 설정하세요.</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1.5">코드</div>
            <div className="flex gap-2">
              <input
                value={form.code}
                onChange={(e) => onChange("code", e.target.value.toUpperCase())}
                className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
                placeholder="PROMO-XXXX"
              />
              {!isEdit && (
                <IconButton title="코드 생성" onClick={() => onChange("code", genCode())}>
                  <ShieldCheck className="size-4" /> 생성
                </IconButton>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1.5">이름</div>
            <input
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
              placeholder="예: 신규회원 10% 할인"
            />
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1.5">종류</div>
            <select
              value={form.type}
              onChange={(e) => onChange("type", e.target.value)}
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
            >
              <option value="percent">퍼센트(%)</option>
              <option value="fixed">정액(원)</option>
              <option value="shipping">무료배송</option>
            </select>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1.5">
              할인값 {form.type === "percent" ? "(%)" : form.type === "fixed" ? "(원)" : "(무료배송은 0)"}
            </div>
            <input
              type="number"
              min="0"
              value={form.value}
              onChange={(e) => onChange("value", e.target.value)}
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
            />
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1.5">최소 주문금액(원)</div>
            <input
              type="number"
              min="0"
              value={form.minOrder}
              onChange={(e) => onChange("minOrder", e.target.value)}
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
            />
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1.5">시작일</div>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => onChange("startDate", e.target.value)}
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
            />
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1.5">종료일</div>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => onChange("endDate", e.target.value)}
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
            <div className="text-sm text-gray-700">활성화</div>
            <Switch checked={form.active} onChange={() => onChange("active", !form.active)} />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-2">
          <button onClick={onClose} className="h-11 rounded-xl px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
            취소
          </button>
          <button onClick={submit} className="h-11 rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white hover:bg-violet-700">
            저장
          </button>
        </div>
      </div>
    </Modal>
  );
}