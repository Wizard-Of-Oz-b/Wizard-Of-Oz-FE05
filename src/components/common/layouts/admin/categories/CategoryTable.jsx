import IconButton from "../common/IconButton";
import { Pencil, Trash2 } from "lucide-react";
import CopyMono from "./CopyMono";
import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

export default function CategoryTable({ pageData = [], openEdit, openDelete }) {
  const tree = buildTree(pageData);

  const ordered = flattenWithDepth(tree);

  return (
    <div className="relative overflow-x-auto rounded-2xl shadow-lg bg-white">
      <table className="min-w-[980px] w-full">
        <thead className="bg-gradient-to-r from-violet-600 to-violet-700 text-white text-left text-xs font-semibold uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 rounded-tl-2xl">카테고리</th>
            <th className="px-4 py-3">분류</th>            
            <th className="px-4 py-3">자식 수</th>
            <th className="px-4 py-3">카테고리 생성일자</th>
            <th className="px-4 py-3">카테고리 고유 ID</th>
            <th className="px-4 py-3 text-center rounded-tr-2xl">기능</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 text-sm">
          {ordered.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-10 text-center text-gray-500">
                카테고리가 없습니다.
              </td>
            </tr>
          ) : (
            ordered.map((c) => (
              <tr key={c.id} className="hover:bg-violet-50/30 transition-colors">
                {/* 카테고리명 */}
                <td className="px-4 py-4">
                  <div
                    style={{ paddingLeft: `${(c._depth ?? 0) * 20}px` }}
                    className="flex items-center gap-2"
                  >
                    {(c._depth ?? 0) > 0 && (
                      <span className="inline-block w-3 h-0.5 bg-violet-200 rounded" />
                    )}
                    <span className="font-semibold text-gray-800">{c.name}</span>
                    {isRoot(c) && (
                      <span className="ml-1 text-[10px] rounded bg-gray-100 px-1.5 py-0.5 text-gray-600">
                        ROOT
                      </span>
                    )}
                  </div>
                </td>

                {/* 계층: L1/L2/L3 를 대/중/소 분류 */}
                <td className="px-4 py-4 text-gray-700">
                  {levelToLabel(c.level)}
                </td>

                {/* 직계 하위 계층 수 */}
                <td className="px-4 py-4 text-gray-700 tabular-nums">
                  {c.children_count ?? 0}
                </td>

                 {/* 생성일자 */}
                <td className="px-4 py-4 text-gray-600 tabular-nums">
                  {c.created_at
                    ? dayjs(c.created_at).format("YYYY년 MM월 DD일 HH시 mm분")
                    : "—"}
                </td>

                {/* UUID */}
                <td className="px-4 py-4">
                  <CopyMono text={c.id} short />
                </td>

                {/* 기능 */}
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <IconButton
                      title="수정"
                      onClick={() => openEdit?.(c)}
                      className="border-gray-200"
                    >
                      <Pencil className="size-4" /> 수정
                    </IconButton>
                    <IconButton
                      title="삭제"
                      onClick={() => openDelete?.(c)}
                      className="bg-rose-600 text-white hover:bg-rose-700 border-transparent"
                    >
                      <Trash2 className="size-4" /> 삭제
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function getParentId(row) {
  if (row.parent !== undefined) return row.parent ?? null;
  if (row.parentId !== undefined) return row.parentId ?? null;
  return null;
}

function isRoot(row) {
  return getParentId(row) === null;
}

// 평면으로 출력되는걸 트리로.
function buildTree(list) {
  const byId = new Map();
  const childrenMap = new Map();

  list.forEach((row) => {
    byId.set(row.id, { ...row, children: [] });
  });

  // 상위-하위 계층 연결
  list.forEach((row) => {
    const pid = getParentId(row);
    if (pid) {
      const parent = byId.get(pid);
      if (parent) {
        parent.children.push(byId.get(row.id));
      } else {
        // 상위계층 데이터가 누락된 데이터면 상위계층으로 취급하기
        childrenMap.set(row.id, byId.get(row.id));
      }
    }
  });

  const roots = [];
  byId.forEach((node) => {
    const pid = getParentId(node);
    if (!pid || !byId.get(pid)) roots.push(node);
  });

  const sortKids = (nodes) => {
    nodes.sort((a, b) => String(a.name).localeCompare(String(b.name), "ko"));
    nodes.forEach((n) => n.children?.length && sortKids(n.children));
  };
  sortKids(roots);

  return roots;
}

function flattenWithDepth(roots) {
  const out = [];
  const walk = (nodes, depth = 0) => {
    nodes.forEach((n) => {
      out.push({ ...n, _depth: depth });
      if (n.children?.length) walk(n.children, depth + 1);
    });
  };
  walk(roots, 0);
  return out;
}

// 대/중/소 라벨링
function levelToLabel(level) {
  if (!level) return "—";
  const lv = String(level).toLowerCase();
  if (lv === "l1") return "대분류";
  if (lv === "l2") return "중분류";
  if (lv === "l3") return "소분류";
  return level.toUpperCase?.() || String(level);
}
