import { Gift, Info, Sparkles, Ticket, Truck } from "lucide-react";

/** 통화 포맷터 */
export const KRW = (n = 0) =>
  new Intl.NumberFormat("ko-KR").format(Math.max(0, Number(n) || 0)) + "원";

/** 등급 테이블 */
export const TIERS = [
  {
    key: "rookie",
    label: "Rookie",
    threshold: 0,
    color: "from-slate-100 to-white",
    highlight: "border-slate-300",
    perks: [
      { icon: Ticket, text: "웰컴 3% 할인쿠폰 1장" },
      { icon: Info, text: "리뷰 적립 200P" },
    ],
  },
  {
    key: "member",
    label: "Member",
    threshold: 200000,
    color: "from-indigo-50 to-white",
    highlight: "border-indigo-300",
    perks: [
      { icon: Ticket, text: "상시 3% 할인 (쿠폰)" },
      { icon: Truck, text: "월 1회 무료배송쿠폰" },
    ],
  },
  {
    key: "silver",
    label: "Silver",
    threshold: 500000,
    color: "from-violet-50 to-white",
    highlight: "border-violet-300",
    perks: [
      { icon: Ticket, text: "상시 5% 할인 (쿠폰)" },
      { icon: Truck, text: "월 2회 무료배송쿠폰" },
      { icon: Gift, text: "생일 1만원 쿠폰" },
    ],
  },
  {
    key: "gold",
    label: "Gold (VIP)",
    threshold: 1000000,
    color: "from-fuchsia-50 to-white",
    highlight: "border-fuchsia-300",
    perks: [
      { icon: Ticket, text: "상시 7% 할인 (쿠폰)" },
      { icon: Truck, text: "월 3회 무료배송쿠폰" },
      { icon: Gift, text: "분기별 스페셜 쿠폰팩" },
    ],
  },
  {
    key: "platinum",
    label: "Platinum (VVIP)",
    threshold: 2000000,
    color: "from-rose-50 to-white",
    highlight: "border-rose-300",
    perks: [
      { icon: Ticket, text: "상시 10% 할인 (쿠폰)" },
      { icon: Truck, text: "월 4회 무료배송쿠폰" },
      { icon: Gift, text: "분기별 특별 사은품" },
      { icon: Sparkles, text: "한정 상품 얼리액세스" },
    ],
  },
];

/** 현재/다음 등급 및 진행률 계산 */
export function resolveTier(total) {
  const ordered = [...TIERS].sort((a, b) => a.threshold - b.threshold);
  let cur = ordered[0];
  let next = null;

  for (let i = 0; i < ordered.length; i++) {
    if (total >= ordered[i].threshold) {
      cur = ordered[i];
      next = ordered[i + 1] ?? null;
    }
  }

  const base = cur.threshold;
  const target = next ? next.threshold : base;
  const pct = next
    ? Math.min(100, Math.floor(((total - base) / (target - base)) * 100))
    : 100;
  const remain = next ? Math.max(0, target - total) : 0;

  return { cur, next, pct, remain };
}
