export function buildSearchURL(q, primary) {
  const qs = new URLSearchParams({ q: String(q || "").trim(), page: "1", sort: "created_at" });
  if (primary) qs.set("primary", String(primary));
  return `/results/test?${qs.toString()}`;
}
