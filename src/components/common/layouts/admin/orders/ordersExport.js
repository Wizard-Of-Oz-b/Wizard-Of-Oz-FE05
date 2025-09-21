import * as XLSX from 'xlsx';

export function normalizeDateString(d) {
  if (!d) return '';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return '';
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export function pickOrderDate(o) {
  return o?.ordered_at || o?.created_at || o?.paid_at || o?.orderDate || null;
}

// 엑셀 column : 이름, 주소, 전화번호, 주문번호, 주문일자, 품명
export function flattenOrdersToRows(orders = []) {
  const rows = [];
  orders.forEach((o) => {
    const orderId = o?.id ?? o?.purchase_id ?? o?.purchaseId ?? '';
    const orderDate = normalizeDateString(pickOrderDate(o));
    const base = {
      이름: o?.customer ?? '',
      주소: o?.address ?? '',
      전화번호: o?.phone ?? '',
      주문번호: orderId,
      주문일자: orderDate,
    };
    const items = Array.isArray(o?.items) ? o.items : [];
    if (items.length === 0) {
      rows.push({ ...base, 품명: '' });
    } else {
      items.forEach((it) => {
        const nameRaw = it?.name ?? it?.product_name ?? '';
        const name = typeof nameRaw === 'string' ? nameRaw : JSON.stringify(nameRaw ?? '');
        rows.push({ ...base, 품명: name });
      });
    }
  });
  return rows;
}

export function exportOrdersToXlsx({
  orders = [],
  startDate = '',
  endDate = '',
  page = 1,
  filenamePrefix = 'Orders',
}) {
  const rows = flattenOrdersToRows(orders || []);
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Orders');

  const s = (startDate || '').replaceAll('-', '');
  const e = (endDate || '').replaceAll('-', '');
  const filename = `${filenamePrefix}_${s || 'ALL'}-${e || 'ALL'}_p${page}.xlsx`;

  XLSX.writeFile(wb, filename);
}
