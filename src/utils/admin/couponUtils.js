// 추후 확장 가능성을 위해 제작하였습니다.

export function fmtMoney(n) {
  try { return Number(n).toLocaleString(); } catch { return n; }
}

export function getStatus(now, c) {
  if (!c.active) return "비활성";
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const s = c.startDate ? new Date(c.startDate) : null;
  const e = c.endDate ? new Date(c.endDate) : null;
  if (s && today < s) return "예정";
  if (e && today > e) return "만료";
  return "진행중";
}

export function toYMD(d) {
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // 월(0) 시작
  d.setDate(d.getDate() - day);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function endOfWeek(date) {
  const s = startOfWeek(date);
  s.setDate(s.getDate() + 6);
  return new Date(s.getFullYear(), s.getMonth(), s.getDate());
}
