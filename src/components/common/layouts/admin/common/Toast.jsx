import React from "react";
import { X } from "lucide-react";

/**
 * Toast
 * @param {Array<{id:number, message:string, type?:'success'|'error'|'info', description?:string}>} list
 * @param {(id:number)=>void} remove
 */
export default function Toast({ list, remove }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      {list.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-2 rounded-xl px-4 py-3 shadow-lg text-white ${
            t.type === "success"
              ? "bg-emerald-600"
              : t.type === "error"
              ? "bg-rose-600"
              : "bg-gray-800"
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="flex-1">
            <div className="font-semibold">{t.message}</div>
            {t.description && (
              <div className="text-sm text-white/90">{t.description}</div>
            )}
          </div>
          <button
            type="button"
            onClick={() => remove(t.id)}
            className="p-1 hover:bg-white/20 rounded-md"
            aria-label="닫기"
            title="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
