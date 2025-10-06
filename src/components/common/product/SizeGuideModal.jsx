import React, { useEffect, useMemo, useState } from "react";
import { X, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SizeGuideModal({ open, onClose, sizeChart }) {
  if (!open) return null;

  const chart = Array.isArray(sizeChart) && sizeChart.length
    ? sizeChart
    : [
        { label: "어깨", S: 43, M: 45, L: 47, XL: 49, XXL: 51 },
        { label: "가슴", S: 50, M: 52, L: 55, XL: 58, XXL: 61 },
        { label: "총장", S: 68, M: 70, L: 72, XL: 74, XXL: 76 },
        { label: "소매", S: 60, M: 61, L: 62, XL: 63, XXL: 64 },
      ];

  const headers = useMemo(() => {
    const pref = ["XS","S","M","L","XL","XXL","3XL","4XL"];
    const present = pref.filter((k) => chart.some((row) => row[k] != null));
    return present.length ? present : [];
  }, [chart]);

  // ----- ESC로 모달 닫기 -----
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // ===== 사이즈 추천 (키/몸무게) =====
  const [fitOpen, setFitOpen] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fit, setFit] = useState("regular"); // slim / regular / loose
  const [rec, setRec] = useState(null);

  const sizeOrder = headers;

  function clampIndex(i) {
    if (i < 0) return 0;
    if (i > sizeOrder.length - 1) return sizeOrder.length - 1;
    return i;
  }

  function recommend() {
    const h = Number(height);
    const w = Number(weight);
    if (!h || !w || !sizeOrder.length) {
      setRec(null);
      return;
    }

    // 1) 키 기반 대략 인덱스
    //    165↓: index 0~1, 170~175: 1~2, 176~180: 2~3, 181↑: 3~4 이상
    let baseIdx =
      h < 165 ? 0 :
      h < 170 ? 1 :
      h < 176 ? 2 :
      h < 181 ? 3 :
      4;

    // 2) 몸무게로 보정 (대략치)
    if (w < 58) baseIdx -= 1;
    else if (w > 78) baseIdx += 1;
    else if (w > 88) baseIdx += 2;

    // 3) 핏 반영
    if (fit === "slim") baseIdx -= 1;
    if (fit === "loose") baseIdx += 1;

    baseIdx = clampIndex(baseIdx);

    // 4) 가슴 단면(또는 총장/어깨)로 미세 조정
    const chestRow = chart.find((r) => /가슴|가슴단면|Bust|Chest/i.test(r.label || ""));
    const shoulderRow = chart.find((r) => /어깨|Shoulder/i.test(r.label || ""));
    const lengthRow = chart.find((r) => /총장|Length/i.test(r.label || ""));

    // 체형 간이 모델: 가슴둘레 추정치(cm) ≈ 0.51 * 키 + 0.32 * 몸무게 - 15 (대략)
    const estChest = Math.round(0.51 * h + 0.32 * w - 15);
    const targetRow = chestRow || shoulderRow || lengthRow;
    if (targetRow) {
      // 각 사이즈 값과의 차이를 비교해 가장 가까운 쪽으로 ±1 보정
      const curSize = sizeOrder[baseIdx];
      const curVal = Number(targetRow[curSize]);
      // 좌/우 후보
      const leftIdx = clampIndex(baseIdx - 1);
      const rightIdx = clampIndex(baseIdx + 1);
      const leftVal = Number(targetRow[sizeOrder[leftIdx]]);
      const rightVal = Number(targetRow[sizeOrder[rightIdx]]);

      const diffCur = Math.abs((curVal || 0) * 2 - estChest); // 단면->둘레 추정 *2
      const diffLeft = Math.abs((leftVal || 0) * 2 - estChest);
      const diffRight = Math.abs((rightVal || 0) * 2 - estChest);

      if (diffLeft < diffCur && leftIdx !== baseIdx) baseIdx = leftIdx;
      if (diffRight < Math.min(diffCur, diffLeft) && rightIdx !== baseIdx) baseIdx = rightIdx;
    }

    setRec(sizeOrder[baseIdx] || null);
  }

  const pop = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 8 } };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog" aria-modal="true" onClick={onClose}>
      {/* Backdrop */}
      <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      {/* Panel */}
      <motion.div
        className="relative w-[92vw] max-w-2xl overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 240, damping: 20 } }}
        exit={{ scale: 0.98, opacity: 0 }}
      >
        {/* 헤더 */}
        <div className="relative">
          <motion.div className="h-24 bg-gradient-to-r from-gray-800 via-black to-gray-700" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-4">
            <div className="text-white">
              <h2 className="text-base sm:text-lg font-semibold tracking-tight">사이즈 가이드</h2>
              <p className="mt-0.5 text-xs sm:text-[13px] text-white/80">실측 기준표를 참고해 알맞은 사이즈를 선택하세요.</p>
            </div>
            <button
              aria-label="닫기"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-5 pt-4">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-1.5 overflow-x-auto no-scrollbar"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
              >
                {headers.map((h) => (
                  <motion.span
                    key={h}
                    className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {h}
                  </motion.span>
                ))}
                {!headers.length && (
                  <span className="text-xs text-gray-500">등록된 사이즈 항목이 없어요</span>
                )}
              </motion.div>
            </div>

            {/* 사이즈 추천 토글 */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setFitOpen((v) => !v)}
              className="ml-3 inline-flex items-center gap-1 rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-900"
              title="사이즈 추천 열기"
            >
              <Wand2 className="h-3.5 w-3.5" />
              사이즈 추천
            </motion.button>
          </div>

          {/* 추천 패널 */}
          <AnimatePresence initial={false}>
            {fitOpen && (
              <motion.div {...pop} className="mt-3 rounded-2xl border border-gray-200 bg-gray-50/70 px-3.5 py-3">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div>
                    <label className="block text-[11px] text-gray-600 mb-1">키 (cm)</label>
                    <input
                      inputMode="numeric"
                      value={height}
                      onChange={(e) => setHeight(e.target.value.replace(/[^\d]/g, ""))}
                      className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                      placeholder="173"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-600 mb-1">몸무게 (kg)</label>
                    <input
                      inputMode="numeric"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value.replace(/[^\d]/g, ""))}
                      className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                      placeholder="68"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-gray-600 mb-1">핏 선호</label>
                    <div className="flex gap-1.5">
                      {["slim","regular","loose"].map((k) => (
                        <button
                          key={k}
                          onClick={() => setFit(k)}
                          className={`rounded-lg border px-2.5 py-1.5 text-sm capitalize ${
                            fit === k ? "border-black bg-black text-white" : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                          }`}
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={recommend}
                    className="rounded-lg bg-black px-3 py-2 text-sm text-white hover:bg-gray-900"
                  >
                    추천 받기
                  </button>

                  <AnimatePresence>
                    {rec && (
                      <motion.div
                        key={rec}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="inline-flex items-center gap-2"
                      >
                        <span className="text-xs text-gray-600">추천 사이즈는{" "}</span>
                        <span className="rounded-full bg-violet-100 text-violet-700 ring-1 ring-violet-200 px-2.5 py-1 text-xs font-semibold">
                          {rec}
                        </span>
                        <span className="text-xs text-gray-600">입니다.</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 표 영역 */}
        <div className="px-5 pb-5 pt-4">
          <div className="overflow-x-auto rounded-2xl ring-1 ring-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="py-3 pl-4 pr-3 font-semibold">항목</th>
                  {headers.map((h) => (
                    <th key={h} className="py-3 px-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chart.map((row, i) => (
                  <tr key={row.label || i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                    <td className="py-3 pl-4 pr-3 font-medium text-gray-900">{row.label ?? "-"}</td>
                    {headers.map((h) => (
                      <td key={h} className="py-3 px-3 text-gray-800">{row[h] ?? "-"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 안내 텍스트 */}
          <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-[13px] leading-relaxed text-gray-600 ring-1 ring-gray-100">
            <ul className="list-disc pl-4 space-y-1">
              <li>단위: cm 기준입니다.</li>
              <li>측정 위치/방법에 따라 ±1–2cm 오차가 있을 수 있어요.</li>
              <li>두 사이즈 사이에 애매하면 한 사이즈 크게 추천드려요.</li>
            </ul>
          </div>
        </div>

        {/* 푸터 */}
        <div className="border-t border-gray-200 bg-white px-5 py-3 flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">닫기</button>
        </div>
      </motion.div>
    </div>
  );
}
