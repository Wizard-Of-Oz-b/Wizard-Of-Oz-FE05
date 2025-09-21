export function parseOptions(opts = []) {
  const color = opts.find((o) => (o?.id || '').toUpperCase() === 'OPT_COLOR' || o?.type === 'color')?.values || [];
  const size  = opts.find((o) => (o?.id || '').toUpperCase() === 'OPT_SIZE'  || o?.type === 'size')?.values || [];
  const colors = color.map((v) => ({ code: v.value, label: v.display || v.value, hex: v.hexCode }));
  const sizes  = size.map((v) => ({ code: v.value, label: v.display || v.value }));
  return { colors, sizes };
}

export function cartesian(colors, sizes) {
  const C = colors.length ? colors : [{ code: '-', label: '-' }];
  const S = sizes.length ? sizes : [{ code: '-', label: '-' }];
  const rows = [];
  C.forEach((c) => {
    S.forEach((s) => {
      rows.push({ key: `C:${c.code}|S:${s.code}`, color: c, size: s, checked: false, qty: 0 });
    });
  });
  return rows;
}

export const toHaystack = (p) => {
  const { colors, sizes } = parseOptions(p.options);
  return [
    p?.name || '',
    p?.category_name || '',
    ...colors.map((c) => c.label || c.code || ''),
    ...sizes.map((s) => s.label || s.code || ''),
  ].join(' ').toLowerCase();
};
