import { CATEGORY_ID_MAP } from "../constants/categoryIdMap";

export function getCategoryId(primary, item) {
  if (!primary || !item) return null;

  const P = String(primary).toUpperCase();
  const bucket = CATEGORY_ID_MAP[P];
  if (!bucket) return null;

  return bucket[String(item)] ?? null;
}
