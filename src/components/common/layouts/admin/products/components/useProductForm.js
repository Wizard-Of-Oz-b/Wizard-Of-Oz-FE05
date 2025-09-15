import { useEffect, useState, useCallback } from "react";

const INITIAL_FORM = {
  id: "", name: "", sku: "", price: 0, category: "상의",
  image_url: "", is_available: true,
  created_at: new Date().toISOString().slice(0, 10),

  brand: "", rating: 0, ratingCount: 0,
  colors: [{ code: "", name: "", hex: "#000000" }],
  sizes: ["M"],
  gallery: [""],
  details: [{ img: "", text: "" }],
  material: [""],
  care: [""],
  gender: "men",
  category_key: "top",
};

export default function useProductForm(initial) {
  const [form, setForm] = useState(INITIAL_FORM);
  const isEdit = !!initial;

  useEffect(() => {
    if (initial) setForm((f) => ({ ...f, ...initial }));
  }, [initial]);

  const set = useCallback((k, v) => setForm((f) => ({ ...f, [k]: v })), []);
  const addRow = useCallback((key, emptyVal) => {
    set(key, [...(form[key] || []), emptyVal]);
  }, [form, set]);
  const delRow = useCallback((key, idx) => {
    set(key, (form[key] || []).filter((_, i) => i !== idx));
  }, [form, set]);

  return { form, set, addRow, delRow, isEdit };
}
