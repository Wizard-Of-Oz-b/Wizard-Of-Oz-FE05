export function bySort(a, b) {
  if (a.sort === b.sort) return a.name.localeCompare(b.name);
  return a.sort - b.sort;
}

// export function buildTree(list) {
//   const map = new Map();
//   list.forEach((c) => map.set(c.id, { ...c, children: [] }));
//   const roots = [];
//   for (const node of map.values()) {
//     if (node.parentId == null) roots.push(node);
//     else if (map.has(node.parentId)) map.get(node.parentId).children.push(node);
//   }
//   const sortRec = (n) => {
//     n.children.sort(bySort).forEach(sortRec);
//   };
//   roots.sort(bySort).forEach(sortRec);
//   return roots;
// }

// 순환 방어하기 위한 목적
export function buildTree(list) {
  const map = new Map(list.map(c => [c.id, { ...c, children: [] }]));
  const roots = [];
  for (const node of map.values()) {
    if (node.parentId == null || !map.has(node.parentId)) roots.push(node);
    else map.get(node.parentId).children.push(node);
  }
  const seen = new Set();
  const dfs = (n) => {
    if (seen.has(n.id)) return; // 순환 방지
    seen.add(n.id);
    n.children.sort(bySort).forEach(dfs);
  };
  roots.sort(bySort).forEach(dfs);
  return roots;
}


export function flattenTree(nodes, depth = 0, acc = []) {
  nodes.forEach((n) => {
    acc.push({ ...n, _depth: depth });
    if (n.children?.length) flattenTree(n.children, depth + 1, acc);
  });
  return acc;
}
