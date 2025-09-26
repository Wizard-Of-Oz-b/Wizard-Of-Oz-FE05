
// 알파벳순으로 정렬
export function toOptionQS(obj = {}) {
  const entries = Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '')
    .sort(([a], [b]) => a.localeCompare(b));
  return entries
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
}

export function fromOptionQS(qs = '') {
  const out = {};
  if (!qs) return out;
  for (const pair of qs.split('&')) {
    if (!pair) continue;
    const [rk, rv = ''] = pair.split('=');
    const k = decodeURIComponent(rk || '').trim();
    const v = decodeURIComponent(rv || '').trim();
    if (k) out[k] = v;
  }
  return out;
}
