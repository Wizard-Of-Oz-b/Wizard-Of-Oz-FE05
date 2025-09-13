import Switch from "./Switch";
import IconButton from "./IconButton";
import { Pencil, Trash2 } from "lucide-react";

export default function ProductTable({ pageData, toggleAvailable, deleteProduct }) {
  return (
    <div className="relative overflow-x-auto rounded-2xl shadow-lg bg-white">
      <table className="min-w-[900px] w-full">
        <thead className="bg-gradient-to-r from-violet-600 to-violet-700 text-white text-left text-xs font-semibold uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 rounded-tl-2xl">썸네일</th>
            <th className="px-4 py-3">카테고리</th>
            <th className="px-4 py-3">상품명</th>
            <th className="px-4 py-3">SKU</th>
            <th className="px-4 py-3 text-right">가격</th>
            <th className="px-4 py-3 text-center">판매</th>
            <th className="px-4 py-3 text-center">등록일</th>
            <th className="px-4 py-3 text-center rounded-tr-2xl">기능</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {pageData.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-10 text-center text-gray-500">
                상품이 없습니다.
              </td>
            </tr>
          ) : (
            pageData.map((p) => (
              <tr key={p.id} className="hover:bg-violet-50/40 transition-colors">
                <td className="px-4 py-4">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-14 w-20 object-cover rounded-md shadow-sm"
                  />
                </td>
                <td className="px-4 py-4 font-medium">{p.category}</td>
                <td className="px-4 py-4 font-semibold text-gray-800">
                  {p.name}
                </td>
                <td className="px-4 py-4">{p.sku}</td>
                <td className="px-4 py-4 text-right font-semibold text-violet-700">
                  {p.price.toLocaleString()}원
                </td>
                <td className="px-4 py-4 text-center">
                  <Switch checked={p.is_available} onChange={() => toggleAvailable(p.id)} />
                </td>
                <td className="px-4 py-4 text-center text-gray-600">
                  {p.created_at}
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <IconButton title="수정">
                      <Pencil className="size-4" /> 수정
                    </IconButton>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition"
                    >
                      <Trash2 className="size-4" /> 삭제
                    </button>
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
