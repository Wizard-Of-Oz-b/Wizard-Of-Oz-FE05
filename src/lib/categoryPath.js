const idOf = (r) =>
  r?.id ?? r?.uuid ?? r?.pk ?? r?.ID ?? r?.Id ?? r?.["id"] ?? null;

const parentOf = (r) => {
  if (!r) return null;
  const p = r.parent ?? r.parent_id ?? r.parentId ?? r.Parent ?? null;
  if (!p) return null;
  if (typeof p === "object") return idOf(p);
  return p;
};

// 트리 경로 "A > B > C"로 만드는 맵 ({ "상의 > 셔츠 > 여름" })
export function buildCategoryPathMap(list) {
  const norm = (list || []).map((r) => ({
    id: idOf(r),
    name: r?.name ?? r?.Name ?? "",
    parent: parentOf(r),
  })).filter((r) => !!r.id);

  const byId = new Map(norm.map((r) => [r.id, r]));

  const pathOf = (id) => {
    if (!id) return "";
    const names = [];
    let cur = byId.get(id);
    let guard = 0;
    while (cur && guard++ < 50) {
      names.push(cur.name || "");
      cur = cur.parent ? byId.get(cur.parent) : null;
    }
    return names.reverse().join(" > ");
  };

  const map = {};
  norm.forEach((r) => { map[r.id] = pathOf(r.id); });

  return { map, pathOf };
}
