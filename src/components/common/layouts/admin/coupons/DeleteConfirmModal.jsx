import Modal from "../common/Modal";

export default function DeleteConfirmModal({ open, onClose, target, onConfirm }) {
  if (!target) return null;
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="p-6">
        <h3 className="text-lg font-bold">쿠폰/프로모션 삭제</h3>
        <p className="mt-2 text-sm text-gray-600">
          <b>{target.name}</b> (<code className="text-xs">{target.code}</code>) 을(를) 삭제하시겠어요? 이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="h-10 rounded-xl px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
            닫기
          </button>
          <button
            onClick={() => onConfirm(target.id)}
            className="h-10 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white hover:bg-rose-700"
          >
            삭제
          </button>
        </div>
      </div>
    </Modal>
  );
}