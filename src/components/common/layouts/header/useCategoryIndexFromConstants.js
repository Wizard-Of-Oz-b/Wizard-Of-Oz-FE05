// import { useEffect, useMemo, useState, useCallback } from "react";
// import { PRIMARY, SUBS } from "./constants";
// import { fetchCategories } from "../../api/admin/categoryService";

// const getLevel = (r) => {
//   const v = r.level ?? r.lv ?? r.level_no ?? r.levelNum;
//   if (v == null) return null;
//   const s = String(v).trim().toUpperCase();
//   if (s === "L1" || s === "1") return "L1";
//   if (s === "L2" || s === "2") return "L2";
//   if (s === "L3" || s === "3") return "L3";
//   return s;
// };
// const getParent = (r) => r.parent ?? r.parent_id ?? r.parentId ?? null;

// const norm = (s) =>
//   String(s ?? "")
//     .trim()
//     .replace(/\s+/g, "")
//     .toLowerCase();

// const PRIMARY_ALIAS = {
//   MEN:   ["MEN","MENS","남성","남자","man","men"],
//   WOMEN: ["WOMEN","WOMANS","WOMENS","여성","여자","woman","women"],
//   KIDS:  ["KIDS","kid","kids","키즈","아동"],
//   EVENT: ["EVENT","이벤트","event"],
// };
// const normalizePrimaryKey = (v) => {
//   if (!v) return null;
//   const up = String(v).toUpperCase();
//   if (PRIMARY_ALIAS[up]) return up;
//   for (const [key, arr] of Object.entries(PRIMARY_ALIAS)) {
//     if (arr.map(norm).includes(norm(v))) return key;
//   }
//   return null;
// };

// export default function useCategoryIndexFromConstants() {
//   const [rows, setRows] = useState([]);
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     (async () => {
//       try {
//         const list = await fetchCategories(); // [{id,name,level,parent}, ...]
//         setRows(Array.isArray(list) ? list : []);
//       } catch (e) {
//         console.error("[CategoryIndex] fetchCategories error:", e);
//       } finally {
//         setReady(true);
//       }
//     })();
//   }, []);

//   const index = useMemo(() => {
//     const byId = new Map(rows.map((r) => [r.id, r]));
//     const l1s = rows.filter((r) => getLevel(r) === "L1");
//     const roots = rows.filter((r) => getParent(r) == null);

//     // 디버그: 현재 루트/L1 무엇인지 보여주기
//     console.log("[CategoryIndex] roots(names)", roots.map(r => r.name));
//     console.log("[CategoryIndex] L1(names)", l1s.map(r => r.name));

//     const findL1For = (primaryKey) => {
//       const aliases = (PRIMARY_ALIAS[primaryKey] || []).map(norm);
//       const hit = l1s.find((n) => aliases.includes(norm(n.name)));
//       if (!hit) {
//         console.warn("[CategoryIndex] L1 not found for", primaryKey, { aliases, l1s });
//       }
//       return hit || null;
//     };

//     const childrenOf = (id, wantLv) =>
//       rows.filter((r) => getParent(r) === id && (!wantLv || getLevel(r) === wantLv));

//     // ── ① primary별 인덱스 (정상 경로)
//     const l3MapByPrimary = new Map();
//     for (const p of PRIMARY.map((x) => x.key)) {
//       const P = normalizePrimaryKey(p);
//       if (!P) continue;

//       const map = new Map();
//       const l1 = findL1For(P);
//       const groups = SUBS[P] || [];

//       if (l1) {
//         // L1을 찾은 경우: L1 -> L2(title 일치) -> L3(item 일치)
//         groups.forEach(({ title, items }) => {
//           const l2s = childrenOf(l1.id, "L2");
//           const l2 = l2s.find((n) => norm(n.name) === norm(title));
//           if (!l2) {
//             console.warn("[CategoryIndex] L2 not found", { P, want: title, l2s: l2s.map(x=>x.name) });
//             return;
//           }
//           const l3s = childrenOf(l2.id, "L3");
//           items.forEach((itemLabel) => {
//             const want = norm(itemLabel);
//             const m = l3s.filter((n) => {
//                 const nn = norm(n.name);
//                 return nn === want || nn.includes(want) || want.includes(nn);
//             });
//             if (!m.length) {
//               console.warn("[CategoryIndex] L3 not found", { P, l2: l2.name, want: itemLabel, l3s: l3s.map(x=>x.name) });
//               return;
//             }
//             const arr = map.get(itemLabel) || [];
//             m.forEach((n) =>
//               arr.push({ id: n.id, name: n.name, l2Name: l2.name, path: `${l1.name} > ${l2.name} > ${n.name}` })
//             );
//             map.set(itemLabel, arr);
//           });
//         });
//       }

//       l3MapByPrimary.set(P, map);
//     }

//     // ── ② 전역 인덱스(안전모드): L1을 못 찾을 때를 대비해, 전체 트리에서 L3 이름으로 모음
//     const globalItemMap = new Map(); // '아우터' -> [{id, path}]
//     const l2ById = new Map(rows.filter(r => getLevel(r)==="L2").map(r => [r.id, r]));
//     const l1ById = new Map(rows.filter(r => getLevel(r)==="L1").map(r => [r.id, r]));
//     rows.forEach((r) => {
//       if (getLevel(r) !== "L3") return;
//       const l2 = l2ById.get(getParent(r));
//       const l1 = l1ById.get(l2 ? getParent(l2) : null);
//       const path = [l1?.name, l2?.name, r.name].filter(Boolean).join(" > ");
//       const key = r.name; // 이름 그대로 (상수와 동일해야 함)
//       const arr = globalItemMap.get(key) || [];
//       arr.push({ id: r.id, name: r.name, l2Name: l2?.name || "", path });
//       globalItemMap.set(key, arr);
//     });

//     return { l3MapByPrimary, globalItemMap };
//   }, [rows]);

//   const findCategoryIds = useCallback(
//     (primary, item) => {
//       const P = normalizePrimaryKey(primary);
//       const itemKey = String(item || "");
//       // 1순위: primary 매핑
//       if (P) {
//         const map = index.l3MapByPrimary.get(P);
//         const hit = map?.get(itemKey);
//         if (hit?.length) return hit;
//       }
//       // 2순위: 전역(안전모드)
//       const g = index.globalItemMap.get(itemKey);
//       if (g?.length) {
//         console.warn("[CategoryIndex] fallback to global L3 map:", { primary, item, candidates: g });
//         return g;
//       }
//       return [];
//     },
//     [index]
//   );

//   const findFirstCategoryId = useCallback(
//     (primary, item) => findCategoryIds(primary, item)[0]?.id ?? null,
//     [findCategoryIds]
//   );

//   return { ready, findCategoryIds, findFirstCategoryId };
// }

// src/components/common/layouts/header/useCategoryIndexFromConstants.jsx
// 관리자 API 호출 없이, 하드코딩 CATEGORY_ID_MAP만 사용

import { CATEGORY_ID_MAP } from "../../../../constants/categoryIdMap";

export default function useCategoryIndexFromConstants() {
  const ready = true;

  const findCategoryIds = (primary, item) => {
    const P = String(primary || "").toUpperCase();
    const key = String(item || "").trim();
    const id = CATEGORY_ID_MAP[P]?.[key] || null;
    return id ? [{ id, name: key, l2Name: "", path: "" }] : [];
  };

  const findFirstCategoryId = (primary, item) => {
    const arr = findCategoryIds(primary, item);
    return arr[0]?.id ?? null;
  };

  return { ready, findCategoryIds, findFirstCategoryId };
}
