import { useState } from "react";

export function useToasts() {
  const [toasts, setToasts] = useState([]);

  const pushToast = (msg, timeout = 1600) => {
    const id = (crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, timeout);
  };

  const removeToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  return { toasts, pushToast, removeToast };
}
