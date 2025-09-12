// 확장을 위해서.

import { useEffect, useState } from "react";
import { LS_RECENT } from "../models/product";

export function useRecentViewed() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_RECENT);
      setItems(raw ? JSON.parse(raw) : []);
    } catch {}
  }, []);
  return items;
}
