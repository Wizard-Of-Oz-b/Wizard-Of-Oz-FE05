import React from "react";
import IconButton from "../common/IconButton";
import { Pencil, Trash2 } from "lucide-react";

export default function CategoryTable({ pageData = [], openEdit, openDelete }) {
  return (
    <div className="relative overflow-x-auto rounded-2xl shadow-lg bg-white">
      <table className="min-w-[840px] w-full">
        <thead className="bg-gradient-to-r from-violet-600 to-violet-700 text-white text-left text-xs font-semibold uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 rounded-tl-2xl">카테고리</th>
            <th className="px-4 py-3">계층</th>
            <th className="px-4 py-3">코드</th>
            <th className="px-4 py-3 text-center rounded-tr-2-xl">기능</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 text-sm">
          {pageData.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-10 text-center text-gray-500">
                카테고리가 없습니다.
              </td>
            </tr>
          ) : (
            pageData.map((c) => (
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
                    {c.parentId == null && (
                      <span className="ml-1 text-[10px] rounded bg-gray-100 px-1.5 py-0.5 text-gray-600">
                        ROOT
                      </span>
                    )}
                  </div>
                </td>

                {/* 부모 표기 */}
                <td className="px-4 py-4 text-gray-700">
                  {c.parentId == null ? "—" : `parent: ${c.parentId}`}
                </td>

                {/* 코드 (백엔드 데이터 없으면 -) */}
                <td className="px-4 py-4 text-gray-700 tabular-nums">
                  {c.categoryCode ?? c.category_code ?? "—"}
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
