import { useEffect } from "react";

/**
 * 특정 요소의 바깥쪽을 클릭했는지 감지하는 커스텀 훅
 * @param {React.RefObject} ref - 감지할 요소의 ref 객체
 * @param {function} handler - 바깥쪽을 클릭했을 때 실행될 함수
 */
export default function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      //  ref가 없거나, ref의 현재 요소가 클릭된 요소를 포함하고 있으면 아무것도 하지 않음
      // 즉, 모달 안쪽을 클릭하면 여기서 return됨
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      // ref의 바깥쪽을 클릭했으므로, handler 함수를 실행
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리(clean-up)함
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
