import { PRIMARY, SUBS } from "../components/common/layouts/header/constants";

export const norm = (s) =>
  String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "");

const PRIMARY_ALIAS = {
  [norm("남성")]: "MENS",
  [norm("남자")]: "MENS",
  [norm("man")]: "MENS",
  [norm("men")]: "MENS",

  [norm("여성")]: "WOMENS",
  [norm("여자")]: "WOMENS",
  [norm("woman")]: "WOMENS",
  [norm("women")]: "WOMENS",

  [norm("키즈")]: "KIDS",
  [norm("아동")]: "KIDS",
  [norm("kids")]: "KIDS",

  [norm("이벤트")]: "EVENT",
  [norm("event")]: "EVENT",
};

export const normalizePrimary = (input) => {
  if (!input) return null;
  const n = norm(input);
  if (PRIMARY_ALIAS[n]) return PRIMARY_ALIAS[n];
  const keys = PRIMARY.map((p) => p.key);
  if (keys.includes(String(input).toUpperCase())) return String(input).toUpperCase();
  return null;
};

const TITLE_ALIAS = {
  [norm("상의")]: "상의",
  [norm("탑")]: "상의",
  [norm("top")]: "상의",

  [norm("하의")]: "하의",
  [norm("바지")]: "하의",
  [norm("bottom")]: "하의",

  [norm("신발")]: "신발",
  [norm("슈즈")]: "신발",
  [norm("shoes")]: "신발",
};

// 3) 아이템(예: 아우터/긴팔/반팔/…) 동의어
const ITEM_ALIAS = {
  // 아우터
  [norm("아우터")]: "아우터",
  [norm("아웃터")]: "아우터",
  [norm("재킷")]: "아우터",
  [norm("자켓")]: "아우터",
  [norm("트러커재킷")]: "아우터",
  [norm("코트")]: "아우터",
  [norm("패딩")]: "아우터",
  [norm("점퍼")]: "아우터",
  [norm("후드집업")]: "아우터",
  [norm("cardigan")]: "아우터",
  [norm("가디건")]: "아우터",

  // 긴팔
  [norm("긴팔")]: "긴팔",
  [norm("롱슬리브")]: "긴팔",
  [norm("longsleeve")]: "긴팔",

  // 반팔
  [norm("반팔")]: "반팔",
  [norm("티셔츠")]: "반팔",
  [norm("tshirt")]: "반팔",
  [norm("tee")]: "반팔",

  // 스포츠웨어
  [norm("스포츠웨어")]: "스포츠웨어",
  [norm("트레이닝")]: "스포츠웨어",
  [norm("training")]: "스포츠웨어",

  // 하의
  [norm("반바지")]: "반바지",
  [norm("긴바지")]: "긴바지",
  [norm("청바지")]: "청바지",
  [norm("데님")]: "청바지",
  [norm("슬랙스")]: "슬랙스",

  // 신발
  [norm("스니커즈")]: "스니커즈",
  [norm("운동화")]: "스니커즈",
  [norm("구두")]: "구두",
  [norm("샌들")]: "샌들/슬리퍼",
  [norm("슬리퍼")]: "샌들/슬리퍼",
};

const buildReverseIndex = () => {
  const titleMap = new Map();
  const itemMap = new Map(); 

  Object.values(SUBS).forEach((groups) => {
    groups.forEach(({ title, items }) => {
      titleMap.set(norm(title), title);
      items.forEach((it) => itemMap.set(norm(it), it));
    });
  });

  Object.entries(TITLE_ALIAS).forEach(([k, v]) => {
    if (!titleMap.has(k)) titleMap.set(k, v);
  });
  Object.entries(ITEM_ALIAS).forEach(([k, v]) => {
    if (!itemMap.has(k)) itemMap.set(k, v);
  });

  return { titleMap, itemMap };
};

const { titleMap, itemMap } = buildReverseIndex();

export const resolvePath = (pathString) => {
  const tokens = String(pathString ?? "")
    .split(/>|\/|,|›|→/g)
    .map((s) => s.trim())
    .filter(Boolean);

  let primary = null;
  let title = null;
  let item = null;

  tokens.forEach((t) => {
    if (!primary) {
      const p = normalizePrimary(t);
      if (p) {
        primary = p;
        return;
      }
    }
    if (!title) {
      const tt = titleMap.get(norm(t));
      if (tt) {
        title = tt;
        return;
      }
    }
    if (!item) {
      const it = itemMap.get(norm(t));
      if (it) {
        item = it;
      }
    }
  });

  if (primary && item && !title) {
    const groups = SUBS[primary] || [];
    const g = groups.find((gr) => gr.items.includes(item));
    if (g) title = g.title;
  }

  return { primary, title, item };
};

export const normalizeFromParams = ({ primaryParam, qParam }) => {
  const primary = normalizePrimary(primaryParam);
  let title = null;
  let item = null;

  if (qParam) {
    const n = norm(qParam);
    const tHit = titleMap.get(n);
    if (tHit) title = tHit;
    const iHit = itemMap.get(n);
    if (iHit) item = iHit;
  }

  if (primary && !title && item) {
    const groups = SUBS[primary] || [];
    const g = groups.find((gr) => gr.items.includes(item));
    if (g) title = g.title;
  }

  return {
    primary,
    title,
    item,
    keyword: qParam || "",
  };
};

export const toApiFilter = ({ primary, title, item, keyword }) => {
  const filter = {};
  if (primary) filter.primary = primary;
  if (title)   filter.category_title = title;
  if (item)    filter.category_item = item;
  if (keyword) filter.q = keyword;
  return filter;
};

export const toBreadcrumb = ({ primary, title, item }) => {
  if (!primary && !title && !item) return "";
  const primaryLabel =
    PRIMARY.find((p) => p.key === primary)?.label || primary || "";
  return [primaryLabel, title, item].filter(Boolean).join(" > ");
};
