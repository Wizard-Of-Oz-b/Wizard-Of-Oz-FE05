import Modal from "../common/Modal";

export default function DeleteConfirmModal({ open, onClose, product, onConfirm }) {
  if (!product) return null;
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="p-6">
        <h3 className="text-lg font-bold">상품 삭제</h3>
        <p className="mt-2 text-sm text-gray-600">
          <b>{product.name}</b> 상품을 삭제하시겠어요? 이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="h-10 rounded-xl px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={() => onConfirm(product.id)}
            className="h-10 rounded-xl px-5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700"
          >
            삭제
          </button>
        </div>
      </div>
    </Modal>
  );
}
