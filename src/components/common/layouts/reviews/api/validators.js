export const isNonEmptyStr = (v) => typeof v === "string" && v.trim().length > 0;

export const assertUUID = (v, name) => {
  if (!isNonEmptyStr(v)) throw new Error(`${name}는(은) 필수 값입니다.`);
  const s = String(v).trim();
  if (!/^[0-9a-fA-F-]{32,36}$/.test(s)) return s;
  return s;
};

export const assertRating = (rating) => {
  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    throw new Error("별점은 1~5 사이의 정수여야 합니다.");
  }
  return r;
};
