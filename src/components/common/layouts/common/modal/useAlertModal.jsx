import { useState } from "react";
import AlertModal from "./AlertModal";

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

/* 
이 훅은 경고 모달(AlertModal)을 쉽게 사용할 수 있도록 도와줍니다. 다음과 같은 기능을 제공합니다:
      1. showModal: 모달을 표시하는 함수입니다. 제목, 메시지, 색상, 버튼 색상, 아이콘을 인자로 받아 모달의 상태를 설정합니다.
      2. hideModal: 모달을 숨기는 함수입니다. 모달의 상태를 null로 설정합니다.
      3. ModalComponent: 현재 모달 상태에 따라 AlertModal 컴포넌트를 렌더링합니다. 모달이 표시될 때만 렌더링됩니다.

      showModal({ type: "", message: "" });
      type: 모달의 유형을 지정합니다. "success", "warning", "error", "info" 중 하나를 선택할 수 있습니다.
      (기본값은 "info"입니다. 각 유형에 따라 색상, 버튼 색상, 아이콘, 기본 제목이 다릅니다.)
      {ModalComponent}를 컴포넌트 트리에 포함시켜 모달이 필요할 때 렌더링되도록 합니다.
      message: 모달에 표시할 메시지를 지정합니다.
      title: 모달에 표시할 제목을 지정합니다. 지정하지 않으면 각 유형에 따른 기본 제목이 사용됩니다.(필요 시 사용)
      */