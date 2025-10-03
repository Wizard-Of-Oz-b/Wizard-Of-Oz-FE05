import { useEffect, useMemo, useState, useCallback } from "react";
import { fetchCategories } from "../../../api/admin/categoryService";

// ──────────────────────────────
// 유틸
// ──────────────────────────────
const lv = (r) => String(r.level || r.lv || "").toUpperCase();
const parentOf = (r) =>
  r.parent !== undefined ? (r.parent ?? null)
  : r.parentId !== undefined ? (r.parentId ?? null)
  : null;

const norm = (s) =>
  String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "");

// Primary 별칭
const PRIMARY_CANON = ["MEN", "WOMEN", "KIDS", "EVENT"];
const PRIMARY_CANDIDATES = {
  MEN:   ["men", "man", "남성", "남자"],
  WOMEN: ["women", "woman", "여성", "여자"],
  KIDS:  ["kids", "kid", "아동", "키즈"],
  EVENT: ["event", "이벤트"],
};
const normalizePrimary = (p) => {
  const up = String(p || "").toUpperCase();
  if (PRIMARY_CANON.includes(up)) return up;
  const n = norm(p);
  for (const key of PRIMARY_CANON) {
    if (PRIMARY_CANDIDATES[key].some((alias) => norm(alias) === n)) return key;
  }
  return null;
};

// 아이템(소분류) 동의어 → 정규 라벨
const ITEM_ALIAS = {
  [norm("아우터")]: "아우터",
  [norm("자켓")]: "아우터",
  [norm("재킷")]: "아우터",
  [norm("코트")]: "아우터",
  [norm("패딩")]: "아우터",
  [norm("가디건")]: "아우터",

  [norm("긴팔")]: "긴팔",
  [norm("롱슬리브")]: "긴팔",

  [norm("반팔")]: "반팔",
  [norm("티셔츠")]: "반팔",

  [norm("스포츠웨어")]: "스포츠웨어",
  [norm("트레이닝")]: "스포츠웨어",

  [norm("반바지")]: "반바지",
  [norm("긴바지")]: "긴바지",
  [norm("청바지")]: "청바지",
  [norm("데님")]: "청바지",
  [norm("슬랙스")]: "슬랙스",

  [norm("스니커즈")]: "스니커즈",
  [norm("운동화")]: "스니커즈",
  [norm("구두")]: "구두",
  [norm("샌들")]: "샌들/슬리퍼",
  [norm("슬리퍼")]: "샌들/슬리퍼",
};
const normalizeItem = (name) =>
  ITEM_ALIAS[norm(name)] || String(name || "").trim();

// ──────────────────────────────
// Hook
// ──────────────────────────────
export default function useCategoryIndex() {
  const [rows, setRows] = useState([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  // 1) 카테고리 트리 로드
  useEffect(() => {
    (async () => {
      try {
        const list = await fetchCategories(); // [{id,name,level,parent,key?,code?}, ...]
        setRows(Array.isArray(list) ? list : []);
      } catch (e) {
        setError(e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // 2) 인덱스 구성 (메모이즈)
  const index = useMemo(() => {
    const byId = new Map(rows.map((r) => [r.id, r]));
    const l1Candidates = rows.filter((r) => lv(r) === "L1");

    // L1 매칭 (MEN / WOMEN / ...)
    const l1ForPrimary = new Map(); // 'MEN' -> L1 row
    function matchL1(primaryCanon) {
      // key/code 우선
      const hitByKey = l1Candidates.find((r) => {
        const k = String(r.key || r.code || "").toUpperCase();
        return k && k === primaryCanon;
      });
      if (hitByKey) return hitByKey;

      // 이름/라벨이 별칭과 매칭
      const aliases = PRIMARY_CANDIDATES[primaryCanon].map((a) => norm(a));
      const hitByName = l1Candidates.find((r) =>
        aliases.includes(norm(r.name || r.label))
      );
      if (hitByName) return hitByName;

      // 마지막으로 이름이 이미 캐논이면
      const nameHit = l1Candidates.find(
        (r) => String(r.name || "").toUpperCase() === primaryCanon
      );
      if (nameHit) return nameHit;

      return null;
    }
    for (const P of PRIMARY_CANON) {
      const l1 = matchL1(P);
      if (l1) l1ForPrimary.set(P, l1);
    }

    // primary별 item → L3 후보 배열
    const itemMapByPrimary = new Map(); // 'MEN' -> Map('아우터' -> [{id,name,path,l2Name}])
    for (const [P, l1] of l1ForPrimary) {
      const map = new Map();
      const l2s = rows.filter((r) => lv(r) === "L2" && parentOf(r) === l1.id);
      l2s.forEach((l2) => {
        const l3s = rows.filter((r) => lv(r) === "L3" && parentOf(r) === l2.id);
        l3s.forEach((l3) => {
          const raw = String(l3.name || "").trim();
          if (!raw) return;
          const key = normalizeItem(raw);
          const path = [String(l1.name), String(l2.name), String(l3.name)].join(" > ");
          const arr = map.get(key) || [];
          arr.push({ id: l3.id, name: raw, path, l2Name: l2.name });
          map.set(key, arr);
        });
      });
      itemMapByPrimary.set(P, map);
    }

    return { byId, l1ForPrimary, itemMapByPrimary };
  }, [rows]);

  // 3) 조회 함수들 (메모이즈)
  const findCategoryIds = useCallback(
    (primary, item) => {
      const P = normalizePrimary(primary);
      const I = normalizeItem(item);
      if (!P || !I) return [];
      const map = index.itemMapByPrimary.get(P);
      if (!map) return [];
      return map.get(I) || [];
    },
    [index]
  );

  const findFirstCategoryId = useCallback(
    (primary, item) => {
      const arr = findCategoryIds(primary, item);
      return arr[0]?.id ?? null;
    },
    [findCategoryIds]
  );

  return {
    ready,
    error,
    findCategoryIds,
    findFirstCategoryId,
    debugDump: index, // 필요시 디버그
  };
}
