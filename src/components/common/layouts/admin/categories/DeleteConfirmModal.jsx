import Modal from "../common/Modal";

export default function DeleteConfirmModal({ open, onClose, category, hasChildren, onConfirm }) {
  if (!category) return null;
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="p-6">
        <h3 className="text-lg font-bold">카테고리 삭제</h3>
        <p className="mt-2 text-sm text-gray-600">
          <b>{category.name}</b> 카테고리를 삭제하시겠어요?
          {hasChildren ? (
            <>
              <br />
              <span className="text-rose-600 font-medium">하위 카테고리가 있어 삭제할 수 없습니다.</span>
              <br />
              하위 항목을 먼저 이동/삭제한 뒤 다시 시도하세요.
            </>
          ) : (
            <> 이 작업은 되돌릴 수 없습니다.</>
          )}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="h-10 rounded-xl px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
            닫기
          </button>
          <button
            onClick={() => !hasChildren && onConfirm(category.id)}
            className={`h-10 rounded-xl px-5 text-sm font-semibold text-white ${hasChildren ? "bg-gray-300 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700"}`}
          >
            삭제
          </button>
        </div>
      </div>
    </Modal>
  );
}
