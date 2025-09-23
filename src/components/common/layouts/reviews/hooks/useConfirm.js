import { useCallback, useRef, useState } from "react";
import ConfirmModal from "../../admin/common/ConfirmModal";

export function useConfirm() {
  const resolverRef = useRef(null);
  const [modal, setModal] = useState({
    open: false,
    title: "알림",
    message: "",
    confirmText: "확인",
    cancelText: "취소",
    danger: false,
  });

  const confirm = useCallback((opts) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setModal((m) => ({ ...m, ...opts, open: true }));
    });
  }, []);

  const handleClose = () => {
    setModal((m) => ({ ...m, open: false }));
    if (resolverRef.current) resolverRef.current(false);
  };

  const handleConfirm = () => {
    setModal((m) => ({ ...m, open: false }));
    if (resolverRef.current) resolverRef.current(true);
  };

  const ModalHost = (
    <ConfirmModal
      open={modal.open}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={modal.title}
      message={modal.message}
      confirmText={modal.confirmText}
      cancelText={modal.cancelText}
      danger={modal.danger}
    />
  );

  return { confirm, ModalHost };
}
