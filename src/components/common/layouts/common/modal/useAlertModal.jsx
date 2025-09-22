import { useState } from "react";
import AlertModal from "./AlertModal";

/**
 * 커스텀 훅: 경고 모달(AlertModal)을 쉽게 사용할 수 있도록 도와줍니다.
 *
 * @returns {Object} 모달 제어 함수와 컴포넌트를 반환합니다.
 * @returns {function(Object): void} return.showModal - 모달을 표시하는 함수
 * @returns {function(): void} return.hideModal - 모달을 숨기는 함수
 * @returns {JSX.Element|null} return.ModalComponent - 현재 상태에 따라 렌더링되는 AlertModal 컴포넌트
 *
 * @example
 * const { showModal, hideModal, ModalComponent } = useAlertModal();
 *
 * // 모달 표시
 * showModal({
 *   type: "success",
 *   title: "완료",
 *   message: "작업이 성공적으로 완료되었습니다."
 * });
 *
 * // JSX에 포함
 * return (
 *   <>
 *     <button onClick={() => showModal({ type: "error", message: "문제가 발생했습니다." })}>
 *       에러 모달 열기
 *     </button>
 *     {ModalComponent}
 *   </>
 * );
 *
 * @typedef {Object} ShowModalOptions
 * @property {"success" | "warning" | "error" | "info"} [type="info"] - 모달 유형
 * @property {string} [title] - 모달 제목 (지정하지 않으면 유형에 따른 기본 제목이 사용됨)
 * @property {string} message - 모달에 표시할 메시지
 */
export function useAlertModal() {
  const [modalProps, setModalProps] = useState(null);

  const showModal = ({ type = "info", title, message }) => {
    setModalProps({ type, title, message });
  };

  const hideModal = () => setModalProps(null);

  const ModalComponent = modalProps ? (
    <AlertModal {...modalProps} onClose={hideModal} />
  ) : null;

  return { showModal, hideModal, ModalComponent };
}
