export function buildTree(list) {
  const byId = new Map();
  list.forEach((n) => byId.set(n.id, { ...n, children: [] }));
  const roots = [];

  byId.forEach((node) => {
    if (node.parentId == null) roots.push(node);
    else {
      const p = byId.get(node.parentId);
      if (p) p.children.push(node);
      else roots.push(node); 급
    }
  });

  return roots;
}

export function flattenTree(nodes, depth = 0, acc = []) {
  nodes.forEach((n) => {
    acc.push({ ...n, _depth: depth });
    if (n.children?.length) flattenTree(n.children, depth + 1, acc);
  });
  return acc;
}

export function normalizeToTree(maybeTreeOrFlat) {
  const looksLikeTree = maybeTreeOrFlat.some((n) => Array.isArray(n?.children));
  return looksLikeTree ? maybeTreeOrFlat : buildTree(maybeTreeOrFlat);
}
