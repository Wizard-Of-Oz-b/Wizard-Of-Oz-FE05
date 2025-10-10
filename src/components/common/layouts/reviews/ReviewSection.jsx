import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReviewCard from "./ui/ReviewCard";
import StarRating from "./ui/StarRating";
import {
  listReviewsByProduct,
  createReview,
  patchReview,
  deleteReview,
} from "./api";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAlertModal } from "../common/modal/useAlertModal";
import { useReviewEligibility } from "./hooks/useReviewEligibility";
import CartLoadingSpin from "../../../features/cart/CartLoadingSpin";

export default function ReviewSection({
  productId,
  currentUserId,
  isAdmin = false,
  initialReviews = [],
  enableCreate = true,
  onCreate,
  onLoginClick,
  pageSize = 20,
  onToast,
}) {
  const { user, isAdmin: adminFromContext, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const { showModal, ModalComponent } = useAlertModal();
  const effectiveIsAdmin = isAdmin || adminFromContext;

  const {
    data: elig,
    isLoading: eligLoading,
    isError: eligError,
  } = useReviewEligibility(productId);

  const authedUserId = useMemo(
    () => currentUserId ?? user?.user_id ?? user?.id ?? null,
    [currentUserId, user?.user_id, user?.id]
  );

  const [rows, setRows] = useState(initialReviews);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const toast = useCallback(
    (type, msg) => {
      if (onToast) onToast(type, msg);
      else if (type === "error") console.error(msg);
      else console.log(msg);
    },
    [onToast]
  );

  const load = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setLoadError(null);
    try {
      const list = await listReviewsByProduct(productId, { page: 1, size: pageSize });
      setRows(Array.isArray(list) ? list : []);
    } catch (e) {
      setLoadError(e);
      toast("error", "리뷰를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [productId, pageSize, toast]);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (alive) await load();
    })();
    return () => {
      alive = false;
    };
  }, [load]);

  // 작성 폼 상태
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const canCreateUI = enableCreate && isLoggedIn && (elig?.eligible === true);

  const canCreate = enableCreate && !!authedUserId;

  const requireLogin = useCallback(() => {
    showModal({
      type: "warning",
      title: "로그인이 필요합니다",
      message: "해당 기능은 회원 전용입니다. 로그인 페이지로 이동할게요.",
    });
    setTimeout(() => {
      if (typeof onLoginClick === "function") onLoginClick();
      else navigate("/login");
    }, 1200);
  }, [navigate, onLoginClick, showModal]);

  const handleCreate = useCallback(async () => {
    if (!isLoggedIn) {
      requireLogin();
      return;
    }
    if (!(elig?.eligible)) {
      toast("error", "구매 이력이 있는 회원만 리뷰를 작성할 수 있어요.");
      return;
    }
    if (!productId) return;
    if (!authedUserId) {
      toast("error", "리뷰를 작성하려면 로그인하세요.");
      return;
    }
    if (!rating || !content.trim()) {
      toast("error", "별점과 내용을 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { product_id: productId, rating, content };
      const created = onCreate ? await onCreate(payload) : await createReview(payload);
      const cid = created.review_id ?? created.id ?? null;
      setRows((prev) => [
        { ...created, review_id: cid, id: cid, user_id: authedUserId, is_mine: true },
        ...prev,
      ]);
      setRating(0);
      setContent("");
      toast("success", "리뷰가 등록되었습니다.");
    } catch {
      toast("error", "리뷰 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }, [isLoggedIn, productId, authedUserId, rating, content, onCreate, toast, navigate]);

  const getOwnerId = (r) =>
    r?.user_id ??
    r?.author_id ??
    r?.author?.user_id ??
    r?.user?.user_id ??
    r?.user?.id ??
    null;

  const isMine = (r) => {
    if (typeof r?.is_mine === "boolean") return r.is_mine;
    const owner = getOwnerId(r);
    if (!owner || !authedUserId) return false;
    return String(owner) === String(authedUserId);
  };

  return (
  <>
    <section className="w-full rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
      <header className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
        <h2 className="text-[15px] font-semibold text-gray-900 tracking-tight">리뷰</h2>
        <span className="text-xs text-gray-500">총 {rows.length.toLocaleString()}개</span>
      </header>

      {/* 작성 폼 */}
      {enableCreate && (
        (isLoggedIn && eligLoading) ? (
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-t-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            리뷰 작성 가능 여부를 확인 중입니다.
          </div>
        ) : (canCreateUI ? (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <StarRating
              value={rating}
              onChange={(v) => {
                if (!isLoggedIn) {
                  setShowNotice(true);
                  setTimeout(() => {
                    setShowNotice(false);
                    navigate("/login");
                  }, 1500);
                  return;
                }
                setRating(v);
              }}
              size={20}
            />
            <button
              onClick={handleCreate}
              disabled={submitting || !isLoggedIn}
              className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium 
                ${
                  isLoggedIn
                  ? "bg-black text-white hover:bg-gray-900"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              등록
            </button>
          </div>
          <div className="mt-3">
            <textarea
              value={content}
              onChange={(e) => {
                if (!isLoggedIn) {
                  setShowNotice(true);
                  setTimeout(() => {
                    setShowNotice(false);
                  }, 1500);
                  return;
                }
                setContent(e.target.value);
              }}
              rows={3}
              className={`w-full rounded-md border border-gray-200 p-2 text-sm outline-none placeholder:text-gray-400 
              ${isLoggedIn ? "bg-white" : "bg-gray-100 cursor-not-allowed"}`}
              placeholder={
                isLoggedIn
                ? "상품 사용 후기를 남겨주세요."
                : "회원만 작성할 수 있습니다."
              }
              disabled={!isLoggedIn}
            />
          </div>
        </div>
        ) : null)
      )}

      {/* 목록 */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-600">
        <div 
          className="w-4 h-4 border-2 border-t-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"
          aria-hidden="true"
        />
          <span role="status" aria-live="polite">리뷰 목록을 불러오고 있습니다.</span>
        </div>
      ) : loadError ? (
        <div className="py-8 text-center text-sm text-red-600">
          리뷰를 불러오지 못했습니다.{" "}
          <button onClick={load} className="text-red-700 hover:text-red-800">다시 시도하기</button>
        </div>
      ) : rows.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-500">아직 작성된 리뷰가 없습니다.</div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {rows.map((r) => {
            const mine = isMine(r);
            const uuid = r.review_id ?? r.id ?? r.uuid ?? null;
            const reactKey = uuid ?? Math.random();

            return (
              <li key={reactKey} className="py-4">
                {mine && (
                  <span className="mb-2 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700">
                    내 리뷰
                  </span>
                )}
                <ReviewCard
                  review={r}
                  canEdit={effectiveIsAdmin || mine}
                  onSave={async (_ignored, patch) => {
                    if (!uuid) {
                      toast("error", "이 리뷰는 UUID가 없어 수정할 수 없습니다.");
                      return;
                    }
                    const res = await patchReview(uuid, patch);
                    const rid = res?.review_id ?? res?.id ?? uuid;
                    setRows((prev) =>
                      prev.map((x) =>
                        ((x.review_id ?? x.id) === uuid)
                          ? { ...x, ...res, review_id: rid, id: rid }
                          : x
                      )
                    );
                    toast("success", "리뷰가 수정되었습니다.");
                  }}
                  onDelete={async () => {
                    if (!uuid) {
                      toast("error", "이 리뷰는 UUID가 없어 삭제할 수 없습니다.");
                      return;
                    }
                    await deleteReview(uuid);
                    setRows((prev) => prev.filter((x) => (x.review_id ?? x.id) !== uuid));
                    toast("success", "리뷰가 삭제되었습니다.");
                  }}
                  className="!border-0 !shadow-none !p-0"
                  actionClassName="text-xs text-gray-500 hover:text-gray-800"
                />
              </li>
            );
          })}
        </ul>
      )}
    </section>

    {submitting && <CartLoadingSpin />}
    {ModalComponent}    
    </>
  );
}
