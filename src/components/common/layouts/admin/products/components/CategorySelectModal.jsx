import { useEffect, useState } from 'react';
import { FolderTree, X } from 'lucide-react';
import { fetchCategories } from '../../../../api/admin/categoryService';

const levelToLabel = (lv) => {
  const s = String(lv || '').toLowerCase();
  if (s === 'l1') return '대분류';
  if (s === 'l2') return '중분류';
  if (s === 'l3') return '소분류';
  return s || '-';
};

const parentOf = (row) =>
  row.parent !== undefined
    ? row.parent ?? null
    : row.parentId !== undefined
    ? row.parentId ?? null
    : null;

const buildTree = (list) => {
  const map = new Map();
  list.forEach((r) => map.set(r.id, { ...r, children: [] }));
  const roots = [];
  list.forEach((r) => {
    const pid = parentOf(r);
    const node = map.get(r.id);
    if (pid && map.has(pid)) map.get(pid).children.push(node);
    else roots.push(node);
  });
  return roots;
};

function TreeNode({ node, depth = 0, onPick, pickedId }) {
  const isPicked = pickedId === node.id;
  return (
    <div>
      <button
        onClick={() => onPick(node)}
        className={[
          'flex items-center w-full rounded-lg px-3 py-2 text-sm',
          isPicked
            ? 'bg-violet-100 text-violet-700 font-semibold'
            : 'hover:bg-slate-50 text-slate-700',
        ].join(' ')}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        <FolderTree className="w-4 h-4 mr-2 text-slate-400" />
        <span>{node.name}</span>
        <span className="ml-2 text-[11px] text-slate-400">
          {levelToLabel(node.level)}
        </span>
      </button>
      {node.children?.length > 0 &&
        node.children.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            depth={depth + 1}
            onPick={onPick}
            pickedId={pickedId}
          />
        ))}
    </div>
  );
}

export default function CategorySelectModal({
  open,
  onClose,
  value,
  onChange,
}) {
  const [tree, setTree] = useState([]);
  const [picked, setPicked] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      setLoading(true);
      try {
        const list = await fetchCategories();
        setTree(buildTree(list || []));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl flex flex-col max-h-[80vh]"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-900">
            카테고리 선택
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* 리스트 */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <p className="text-sm text-slate-400">불러오는 중…</p>
          ) : (
            tree.map((n) => (
              <TreeNode
                key={n.id}
                node={n}
                onPick={(node) => setPicked(node)}
                pickedId={picked?.id || value}
              />
            ))
          )}
        </div>

        {/* 푸터 */}
        <div className="px-5 py-3 border-t border-slate-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            취소
          </button>
          <button
            onClick={() => {
              if (picked) {
                onChange?.({
                  id: picked.id,
                  label: `${picked.name} (${levelToLabel(picked.level)})`,
                });
              }
              onClose();
            }}
            disabled={!picked}
            className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
          >
            선택
          </button>
        </div>
      </div>
    </div>
  );
}
