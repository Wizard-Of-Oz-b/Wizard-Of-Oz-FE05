import { useEffect, useState } from "react";
import { useAlertModal } from "../../common/layouts/common/modal/useAlertModal";

export default function CartStepper({
  value,
  itemId,
  option,
  onChageValue,
  min = 1,
  max = 50,
}) {
  const [inputValue, setInputValue] = useState(value.toString());
  const { showModal, ModalComponent } = useAlertModal();

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleDecrement = () => {
    if (value > min) {
      onChageValue(itemId, option, value - 1);
    }else{
      showModal({
        type: 'warning',
        title: '적은 값 입력',
        message: '1 이상의 숫자를 입력해 주세요.'
      })
    }
  };
  const handleIncrement = () => {
    if (value < max) {
      onChageValue(itemId, option, value + 1);
    }else{
      showModal({
        type: 'warning',
        title: '재고 부족',
        message: `현 상품은${max} 이하로 보유 하고있어 ${max}로 변경 하겠습니다.`
      })
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    // 입력값이 숫자 또는 빈무자열만 인식
    if (/^\d*$/.test(newValue)) {
      setInputValue(newValue);
    }
  };

  const handleBlur = () => {
    const parsedValue = parseInt(inputValue, 10);

    if (isNaN(parsedValue) || parsedValue < min) {
      showModal({
        type: 'warning',
        title: '적은 값 입력',
        message: '1 이상의 숫자를 입력해 주세요.'
      })
      onChageValue(itemId, option, min);
    } else if (parsedValue > max) {
      showModal({
        type: 'warning',
        title: '재고 부족',
        message: `현 상품은${max} 이하로 보유 하고있어 ${max}(으)로 변경 하겠습니다.`
      })
      onChageValue(itemId, option, max);
    } else {
      onChageValue(itemId, option, parsedValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBlur();
      e.target.blur();
    }
  };

  return (
    <div className="text-center">
      <button
        className="border border-gray-400 rounded-l-md px-1.5 h-8"
        onClick={handleDecrement}
      >
        -
      </button>
      <input
        className="w-10 text-center border-t border-b border-gray-400 h-8"
        onBlur={handleBlur}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        value={inputValue}
      />
      <button
        className="border border-gray-400 rounded-r-md px-1.5 h-8"
        onClick={handleIncrement}
      >
        +
      </button>
      {ModalComponent}
    </div>
  );
}
