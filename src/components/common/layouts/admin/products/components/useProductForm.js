import { useEffect, useState, useCallback } from 'react';
import { hydrateFormFromOptions } from '../../../../api/admin/optionsMapper';

const INITIAL_FORM = {
  id: '',
  name: '',
  price: '',
  category: '',
  is_active: true,

  image_url: '',
  brand: '',
  rating: 0,
  ratingCount: 0,

  colors: [{ code: '', name: '', hex: '#000000' }],
  sizes: [''],
  gallery: [''],
  details: [{ img: '', text: '' }],
  material: [''],
  care: [''],
  gender: 'men',
  category_key: 'top',

  options: [],
};

const categoryIdOf = (c) => {
  if (!c) return '';
  if (typeof c === 'string') return c;
  if (typeof c === 'object') return c.id || c.uuid || c.pk || '';
  return '';
};

function hydrate(initial) {
  const base = { ...INITIAL_FORM };
  if (!initial) return base;

  let merged = {
    ...base,
    ...initial,
    colors: Array.isArray(initial.colors) ? initial.colors : base.colors,
    sizes: Array.isArray(initial.sizes) ? initial.sizes : base.sizes,
    gallery: Array.isArray(initial.gallery) ? initial.gallery : base.gallery,
    details: Array.isArray(initial.details) ? initial.details : base.details,
    material: Array.isArray(initial.material)
      ? initial.material
      : base.material,
    care: Array.isArray(initial.care) ? initial.care : base.care,
    options: Array.isArray(initial.options) ? initial.options : [],
  };

  // 2) category 객체 → id 문자열
  merged.category = categoryIdOf(initial.category);

  // 3) options가 존재하고, colors/sizes가 비어있으면 options에서 갖고옴
  if (merged.options.length) {
    merged = hydrateFormFromOptions(initial, merged);
  }

  // 4) 입력 경고 방지
  merged.name = merged.name ?? '';
  merged.price = merged.price ?? '';
  merged.image_url = merged.image_url ?? '';
  if (!merged.sizes?.length) merged.sizes = [''];

  return merged;
}

export default function useProductForm(initial) {
  const [form, setForm] = useState(() => hydrate(initial));
  const isEdit = !!(initial && (initial.id || initial.uuid || initial.pk));

  useEffect(() => {
    setForm(hydrate(initial));
  }, [initial]);

  const set = useCallback((k, v) => {
    setForm((f) => ({ ...f, [k]: v ?? (typeof v === 'number' ? v : '') }));
  }, []);

  const addRow = useCallback(
    (key, emptyVal) => set(key, [...(form[key] || []), emptyVal]),
    [form, set]
  );

  const delRow = useCallback(
    (key, idx) =>
      set(
        key,
        (form[key] || []).filter((_, i) => i !== idx)
      ),
    [form, set]
  );

  const reset = useCallback(() => {
    setForm({ ...INITIAL_FORM });
  }, []);

  return { form, set, addRow, delRow, isEdit, reset };
}
