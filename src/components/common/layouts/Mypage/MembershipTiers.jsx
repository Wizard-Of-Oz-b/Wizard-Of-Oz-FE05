import React, { useMemo } from "react";
import { Crown } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { KRW, TIERS, resolveTier } from "../../../../constants/membership";

export default function MembershipTiers({ totalSpend = 2000000 }) {
  const { cur, next, pct, remain } = useMemo(
    () => resolveTier(totalSpend),
    [totalSpend]
  );

  const { user } = useAuth();
  const displayName =
    user?.nickname || user?.name || (user?.email?.split("@")[0] ?? "회원");

  return (
    <section className="rounded-2xl bg-white shadow-sm">
      {/* 헤더 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mt-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <Crown className="h-4 w-4" />
              {cur.label}
            </span>
            <span className="text-gray-900 font-semibold">"{displayName}" 고객님</span>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            누적 구매금액 <b>{KRW(totalSpend)}</b>
          </p>
        </div>

        {/* 진행률 */}
        <div className="w-full sm:w-[420px]">
          <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
            <span>등급 진행률</span>
            {next ? (
              <span>
                다음 등급 <b className="text-gray-900">{next.label}</b> 까지 {KRW(remain)} 남음
              </span>
            ) : (
              <span>최고 등급입니다 🎉</span>
            )}
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 현재 등급 혜택 */}
      <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm font-semibold text-gray-900">현재 등급 혜택</p>
        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {cur.perks.map(({ icon: Icon, text }, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
              <Icon className="h-4 w-4 text-gray-600" />
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* 전체 등급 안내 */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900">등급별 혜택 안내</h4>
        </div>

        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          {TIERS.map((t) => (
            <article
              key={t.key}
              className={`rounded-xl border bg-gradient-to-b ${t.color} ${
                t.key === cur.key ? `${t.highlight} shadow-md` : "border-gray-200"
              } p-5 min-h-[200px] flex flex-col`}
            >
              <div className="flex items-start justify-between">
                <p className="font-semibold text-gray-900">{t.label}</p>
                {t.key === cur.key && (
                  <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[11px] text-white leading-none">
                    현재
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-gray-600">기준: {KRW(t.threshold)} 이상</p>

              <ul className="mt-3 space-y-2 leading-relaxed">
                {t.perks.map(({ icon: Icon, text }, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                    <Icon className="h-4 w-4 mt-0.5 text-gray-600 shrink-0" />
                    <span className="line-clamp-2">{text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto" />
            </article>
          ))}
        </div>
      </div>

      {/* 정책 요약 */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-sm font-semibold text-gray-900">운영 정책 (요약)</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-gray-600">
          <li>등급 산정 기준: 최근 12개월 구매금액 합계(또는 누적 금액) 기준 중 택 1.</li>
          <li>승급 즉시 혜택 적용, 강등은 월 1회 정산 시 반영.</li>
          <li>할인쿠폰/무료배송쿠폰은 매월 1일 자동 발급(유효기간 30일).</li>
          <li>VVIP 사은품은 분기 마지막 주에 발송(재고/주소 확인 필요).</li>
        </ul>
      </div>
    </section>
  );
}
