import IconButton from "../common/IconButton";
import Switch from "../common/Switch";
import { ArrowUp, ArrowDown, Pencil, Trash2 } from "lucide-react";

export default function CategoryTable({ pageData, toggleVisible, move, openEdit, openDelete }) {
  return (
    <div className="relative overflow-x-auto rounded-2xl shadow-lg bg-white">
      <table className="min-w-[980px] w-full">
        <thead className="bg-gradient-to-r from-violet-600 to-violet-700 text-white text-left text-xs font-semibold uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 rounded-tl-2xl">카테고리</th>
            <th className="px-4 py-3">슬러그</th>
            <th className="px-4 py-3 text-center">노출</th>
            <th className="px-4 py-3 text-center">상품수</th>
            <th className="px-4 py-3 text-center">정렬</th>
            <th className="px-4 py-3 text-center rounded-tr-2xl">기능</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {pageData.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-10 text-center text-gray-500">카테고리가 없습니다.</td>
            </tr>
          ) : (
            pageData.map((c) => (
              <tr key={c.id} className="hover:bg-violet-50/30 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div style={{ paddingLeft: `${c._depth * 20}px` }} className="flex items-center gap-2">
                      {c._depth > 0 && <span className="inline-block w-3 h-0.5 bg-violet-200 rounded" />}
                      <span className="font-semibold text-gray-800">{c.name}</span>
                      {c.parentId == null && (
                        <span className="ml-1 text-[10px] rounded bg-gray-100 px-1.5 py-0.5 text-gray-600">ROOT</span>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 text-gray-700">{c.slug}</td>

                <td className="px-4 py-4 text-center">
                  <Switch checked={c.visible} onChange={() => toggleVisible(c.id)} />
                </td>

                <td className="px-4 py-4 text-center text-gray-700">{c.product_count ?? 0}</td>

                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <IconButton
                      title="위로"
                      aria-label="위로"
                      onClick={() => move(c.id, -1)}
                      className="h-9 w-9 p-0 rounded-full border-gray-200 text-gray-600 hover:text-violet-700"
                    >
                      <ArrowUp className="size-4" />
                    </IconButton>
                    <IconButton
                      title="아래로"
                      aria-label="아래로"
                      onClick={() => move(c.id, +1)}
                      className="h-9 w-9 p-0 rounded-full border-gray-200 text-gray-600 hover:text-violet-700"
                    >
                      <ArrowDown className="size-4" />
                    </IconButton>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <IconButton
                      title="수정"
                      onClick={() => openEdit(c)}
                      className="border-gray-200"
                    >
                      <Pencil className="size-4" /> 수정
                    </IconButton>
                    <IconButton
                      title="삭제"
                      onClick={() => openDelete(c)}
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
