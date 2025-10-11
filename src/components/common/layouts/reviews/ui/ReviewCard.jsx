import React, { useState } from "react";
import StarRating from "./StarRating";

export default function ReviewCard({
  review,
  canEdit = false,
  onSave,      // (reviewId, {rating, content}) => Promise
  onDelete,    // (reviewId) => Promise
}) {
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(review.rating || 0);
  const [content, setContent] = useState(review.content || "");
  const [busy, setBusy] = useState(false);

  const startEdit = () => {
    setRating(review.rating || 0);
    setContent(review.content || "");
    setEditing(true);
  };

  const save = async () => {
    try {
      setBusy(true);
      await onSave?.(review.review_id ?? review.id, { rating, content });
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!onDelete) return;
    setBusy(true);
    try {
      await onDelete(review.review_id ?? review.id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm text-gray-500">
            {review.user_name || `사용자 #${review.user_id ?? "-"}`}
          </div>
          <div className="text-xs text-gray-400">
            {formatKST(review.created_at)}
          </div>
        </div>

        <div className="shrink-0">
          {editing ? (
            <StarRating value={rating} onChange={setRating} />
          ) : (
            <StarRating value={review.rating || 0} readOnly />
          )}
        </div>
      </div>

      <div className="mt-3">
        {editing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-200 p-2 text-sm outline-none focus:ring-2 focus:ring-violet-300"
            placeholder="리뷰 내용을 입력하세요"
          />
        ) : (
          <p className="whitespace-pre-wrap text-sm text-gray-800">
            {review.content || "내용 없음"}
          </p>
        )}
      </div>

      {canEdit && (
        <div className="mt-3 flex items-center gap-2">
          {editing ? (
            <>
              <button
                onClick={save}
                disabled={busy}
                className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
              >
                저장
              </button>
              <button
                onClick={() => setEditing(false)}
                disabled={busy}
                className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-50"
              >
                취소
              </button>
            </>
          ) : (
            <>
              <button
                onClick={startEdit}
                className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-50"
              >
                수정
              </button>
              <button
                onClick={remove}
                disabled={busy}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                삭제
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function formatKST(ts) {
  if (!ts) return "—";
  try {
    const d = new Date(ts);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}.${m}.${day} ${hh}:${mm}`;
  } catch {
    return "—";
  }
}
