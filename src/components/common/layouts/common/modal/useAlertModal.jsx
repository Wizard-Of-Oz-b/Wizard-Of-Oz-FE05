import { useState } from "react";
import AlertModal from "./AlertModal";

export function useAlertModal() {
  const [modalProps, setModalProps] = useState(null);

  const showModal = ({ title, message, color, btnColor, icon }) => {
    setModalProps({ title, message, color, btnColor, icon });
  };

  const hideModal = () => setModalProps(null);

  const ModalComponent = modalProps ? (
    <AlertModal {...modalProps} onClose={hideModal} />
  ) : null;

  return { showModal, hideModal, ModalComponent };
}

/* 
이 훅은 경고 모달(AlertModal)을 쉽게 사용할 수 있도록 도와줍니다. 다음과 같은 기능을 제공합니다:
    
      /// 예시 사용법
      showModal({
        title: "성공",
        message: "회원가입이 완료되었습니다!",
        color: "text-green-600",
        btnColor: "bg-green-600 hover:bg-green-700",
        icon: "(없어도 됨, 구분을 위해 넣었음)",
      });
      
      1. showModal: 모달을 표시하는 함수입니다. 제목, 메시지, 색상, 버튼 색상, 아이콘을 인자로 받아 모달의 상태를 설정합니다.
      2. hideModal: 모달을 숨기는 함수입니다. 모달의 상태를 null로 설정합니다.
      3. ModalComponent: 현재 모달 상태에 따라 AlertModal 컴포넌트를 렌더링합니다. 모달이 표시될 때만 렌더링됩니다.

      */