import Modal from "./Modal";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export default function ConfirmModal({
  open,
  onClose,
  title = "알림",
  message,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  danger = false,
}) {
  const reduce = useReducedMotion();

  const panelVariants = {
    hidden: { opacity: 0, scale: 0.98, filter: "blur(2px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: reduce
        ? { duration: 0.12 }
        : { type: "spring", stiffness: 420, damping: 32, mass: 0.6 },
    },
    exit: {
      opacity: 0,
      scale: 0.985,
      filter: "blur(1px)",
      transition: { duration: 0.12 },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.12 } },
  };

  return (
    <AnimatePresence>
      {open && (
        <Modal open onClose={onClose} maxWidth="max-w-md">
          <motion.div
            className="p-0"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="p-6"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ willChange: "opacity, transform, filter" }}
            >
              <h3 className="text-lg font-bold leading-none">{title}</h3>

              <p className="mt-3 text-sm text-gray-600 whitespace-pre-line">
                {message}
              </p>

              {/* 버튼 */}
              <div className="mt-6 flex justify-end gap-2">
                <motion.button
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                  onClick={onClose}
                  className="h-10 rounded-xl px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {cancelText}
                </motion.button>

                <motion.button
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                  onClick={onConfirm || onClose}
                  className={`h-10 rounded-xl px-5 text-sm font-semibold text-white ${
                    danger
                      ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-violet-600 hover:bg-violet-700"
                  }`}
                >
                  {confirmText}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
}
