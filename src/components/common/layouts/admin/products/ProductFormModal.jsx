import React, { useState } from "react";
import { Shirt, AlertTriangle } from "lucide-react";
import ModalShell from "./components/ModalShell";
import useProductForm from "./components/useProductForm";
import BasicInfo from "./components/BasicInfo";
import GalleryInputs from "./components/GalleryInputs";
import ColorsInputs from "./components/ColorsInputs";
import SizesInputs from "./components/SizesInputs";
import DetailsInputs from "./components/DetailsInputs";
import MaterialCareInputs from "./components/MaterialCareInputs";
import ConfirmModal from "../common/ConfirmModal";

export default function ProductFormModal({ open, onClose, onSave, initial }) {
  const { form, set, addRow, delRow, isEdit } = useProductForm(initial);

  const [warnOpen, setWarnOpen] = useState(false);
  const [warnMsg, setWarnMsg] = useState("");

  const fail = (msg) => {
    setWarnMsg(msg);
    setWarnOpen(true);
  };

  const submit = () => {
    if (!form.sku?.trim()) return fail("SKU를 입력하세요.");
    if (!form.name?.trim()) return fail("상품명을 입력하세요.");
    if (!form.category?.trim()) return fail("카테고리를 선택하세요.");
    if (Number(form.price) <= 0) return fail("가격을 확인하세요.");

    const payload = {
      ...form,
      price: Number(form.price),
      rating: Number(form.rating) || 0,
      ratingCount: Number(form.ratingCount) || 0,
    };
    onSave?.(payload, isEdit);
    onClose?.();
  };

  return (
    <>
      <ModalShell
        open={open}
        onClose={onClose}
        title={isEdit ? "상품 수정" : "새 상품 추가"}
        subtitle="기본 정보와 상세 콘텐츠를 입력하세요. (갤러리 최대 6장 권장)"
        icon={<Shirt className="size-5" />}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="h-11 rounded-xl px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={submit}
              className="h-11 rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white hover:bg-violet-700"
            >
              저장
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <BasicInfo form={form} set={set} />

          <section className="lg:col-span-3 rounded-2xl border border-gray-100 p-5">
            <GalleryInputs form={form} set={set} addRow={addRow} delRow={delRow} />
            <ColorsInputs  form={form} set={set} addRow={addRow} delRow={delRow} />
            <SizesInputs   form={form} set={set} addRow={addRow} delRow={delRow} />
            <DetailsInputs form={form} set={set} addRow={addRow} delRow={delRow} />
            <MaterialCareInputs form={form} set={set} addRow={addRow} delRow={delRow} />
          </section>
        </div>
      </ModalShell>

      <ConfirmModal
        open={warnOpen}
        onClose={() => setWarnOpen(false)}
        onConfirm={() => setWarnOpen(false)}
        title={
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="size-5" />
            <span>안내</span>
          </div>
        }
        message={warnMsg}
        confirmText="확인"
        showCancel={false}
      />
    </>
  );
}
