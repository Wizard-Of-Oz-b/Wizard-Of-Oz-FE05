import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import Toast from "../../admin/common/Toast";

export function useToasts() {
  const [list, setList] = useState([]);
  const idRef = useRef(1);

  const push = useCallback((type, message, description) => {
    const id = idRef.current++;
    setList((prev) => [...prev, { id, type, message, description }]);
    return id;
  }, []);

  const remove = useCallback((id) => {
    setList((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const timers = list.map((t) =>
      setTimeout(() => remove(t.id), 3000)
    );
    return () => timers.forEach(clearTimeout);
  }, [list, remove]);

  const ToastHost = () => React.createElement(Toast, { list, remove });

  const onToast = useCallback((type, msg) => push(type, msg), [push]);

  return { ToastHost, onToast, push, remove };
}
