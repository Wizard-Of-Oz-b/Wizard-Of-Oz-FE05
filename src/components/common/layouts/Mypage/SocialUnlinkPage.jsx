import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Link2, Link2Off, ShieldAlert, CheckCircle2,
  ChevronRight, ChevronLeft, HeartCrack, ShieldCheck
} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import ConfirmModal from "../admin/common/ConfirmModal";
import Toast from "../admin/common/Toast";
import { unlinkSocial } from "../../../../lib/social";

const providerLabels = {
  google: "Google",
  kakao: "카카오",
  naver: "네이버",
};

const stepVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -14 },
};

export default function SocialUnlinkPage() {
  const navigate = useNavigate();
  const { provider: providerFromPath } = useParams();
  const { user, setUser, refresh } = useAuth?.() || {};

  const [step, setStep] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [agreeMsg, setAgreeMsg] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resultMsg, setResultMsg] = useState("");

  const [toasts, setToasts] = useState([]);
  const pushToast = (message, { type = "info", description, duration = 2600 } = {}) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type, description }]);
    if (duration > 0) setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  };

  // 유저 객체에서 소셜 제공자 목록을 뽑아올게여.
  const providers = useMemo(() => {
    const list = Array.isArray(user?.social_providers)
      ? user.social_providers
      : (user?.auth_provider ? [user.auth_provider] : []);
    return (list || []).filter(Boolean);
  }, [user]);

  useEffect(() => {
    if (providerFromPath) setSelectedProvider(providerFromPath);
    else if (!selectedProvider && providers.length === 1) setSelectedProvider(providers[0]);
  }, [providerFromPath, providers, selectedProvider]);

  // 완료 후 자동으로 이동합니다.
  useEffect(() => {
    if (step === 3) {
      const t = setTimeout(() => navigate("/", { replace: true }), 1500);
      return () => clearTimeout(t);
    }
  }, [step, navigate]);

  const labelOf = (pv) => providerLabels[pv] || pv;

  const goSelectNext = () => {
    if (!selectedProvider) {
      pushToast("연동 해제할 소셜 계정을 선택해 주세요.", { type: "error" });
      return;
    }
    setStep(2);
  };

  const goAgreeNext = () => {
    if (!isAgreed) {
      setAgreeMsg("안내 사항에 동의해야 다음 단계로 진행할 수 있습니다.");
      return;
    }
    setAgreeMsg("");
    setConfirmOpen(true);
  };

  const doUnlink = async () => {
    try {
      await unlinkSocial(selectedProvider);
      setConfirmOpen(false);
      setResultMsg("소셜 연동이 해제되었습니다.");

      if (typeof refresh === "function") {
        await refresh().catch(() => {});
      } else if (typeof setUser === "function" && user) {
        const rest = (user.social_providers || []).filter((p) => p !== selectedProvider);
        setUser({ ...user, social_providers: rest });
      }

      setStep(3);
    } catch (e) {
      setConfirmOpen(false);
      const msg =
        e?.userMessage ||
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        "연동 해제에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      pushToast("연결 해제에 실패하였습니다.", { type: "error", description: msg, duration: 3500 });
    }
  };

  // ───────────────── UI ─────────────────

  const Stepper = () => (
    <div className="w-full">
      <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#7c3aed_0%,#ec4899_100%)] transition-all"
          style={{ width: `${(step - 1) * 50}%` }}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 text-[11px] text-neutral-600">
        <div className={`flex items-center gap-2 ${step >= 1 ? "text-neutral-900" : ""}`}>
          <span className={`h-5 w-5 flex items-center justify-center rounded-full text-white text-[11px]
            ${step >= 1 ? "bg-violet-600" : "bg-neutral-300"}`}>1</span>
          제공자/안내
        </div>
        <div className={`flex items-center gap-2 ${step >= 2 ? "text-neutral-900" : ""}`}>
          <span className={`h-5 w-5 flex items-center justify-center rounded-full text-white text-[11px]
            ${step >= 2 ? "bg-violet-600" : "bg-neutral-300"}`}>2</span>
          확인/해제
        </div>
      </div>
    </div>
  );

  const ProviderChip = ({ p, checked }) => (
    <motion.label
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition
        ${checked ? "border-violet-300 bg-violet-50/70 shadow-sm" : "border-neutral-200 hover:bg-neutral-50"}`}
    >
      <div className="flex items-center gap-3">
        <div className={`h-8 w-8 rounded-xl grid place-items-center
          ${checked ? "bg-violet-100" : "bg-neutral-100"}`}>
          <Link2 className={`h-4 w-4 ${checked ? "text-violet-700" : "text-neutral-500"}`} />
        </div>
        <div className="text-sm">
          <div className="font-semibold text-neutral-900">{labelOf(p)}</div>
          <div className="text-[11px] text-neutral-500">연결된 로그인</div>
        </div>
      </div>

      <input
        type="radio"
        name="provider"
        value={p}
        checked={checked}
        onChange={() => setSelectedProvider(p)}
        className="h-4 w-4 text-violet-600 focus:ring-violet-500"
      />
    </motion.label>
  );

  return (
    <div className="space-y-6">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">소셜 연동 해제</h2>
          <p className="mt-1 text-sm text-neutral-600">연동된 소셜 계정을 해제합니다.</p>
        </div>

        {/* 상단 배지 */}
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1 border border-neutral-200 text-[11px] text-neutral-600 shadow-sm backdrop-blur">
          <ShieldCheck className="h-3.5 w-3.5" />
          연결 상태 관리
        </span>
      </div>

      <div className="rounded-3xl border border-neutral-200/70 bg-white/80 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur">
        <Stepper />

        <AnimatePresence mode="wait">
          {/* 스텝 1: 제공자 선택 + 안내 */}
          {step === 1 && (
            <motion.div
              key={1}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="mt-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <Link2Off className="h-5 w-5 text-neutral-500" />
                <h3 className="text-lg font-semibold">연동된 소셜 선택</h3>
              </div>

              {providers.length === 0 ? (
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-sm text-neutral-700">
                  연동된 소셜 계정이 없습니다.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {providers.map((p) => (
                      <ProviderChip key={p} p={p} checked={selectedProvider === p} />
                    ))}
                  </div>

                  {/* 유의사항 */}
                  <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-neutral-700">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldAlert className="h-4 w-4 text-amber-600" />
                      <span className="font-medium text-amber-700">연동 해제 전 안내</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>연동 해제 후 해당 소셜 계정으로 로그인이 불가합니다.</li>
                      <li>이메일/비밀번호 계정이 없다면, 연동 해제 전에 별도 로그인 수단을 준비해 주세요.</li>
                    </ul>

                    <label className="mt-4 flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isAgreed}
                        onChange={(e) => {
                          setIsAgreed(e.target.checked);
                          setAgreeMsg("");
                        }}
                        className="mt-1 h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-neutral-800">
                        위 내용을 확인하였으며, 이에 동의합니다.
                      </span>
                    </label>
                    {agreeMsg && <p className="mt-2 text-sm text-red-600">{agreeMsg}</p>}
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="px-5 h-10 rounded-full border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50 transition inline-flex items-center gap-1.5"
                      onClick={() => navigate(-1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      돌아가기
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 h-10 rounded-full text-sm font-semibold text-white
                                 bg-[linear-gradient(90deg,#7c3aed_0%,#ec4899_100%)]
                                 shadow-sm hover:shadow-md active:shadow transition inline-flex items-center gap-1.5"
                      onClick={() => {
                        if (!selectedProvider) return pushToast("소셜을 선택해 주세요.", { type: "error" });
                        if (!isAgreed) return setAgreeMsg("안내 사항에 동의해야 다음 단계로 진행할 수 있습니다.");
                        setAgreeMsg("");
                        setStep(2);
                        setConfirmOpen(true);
                      }}
                    >
                      다음 <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* 스텝 2: 최종 패널 */}
          {step === 2 && (
            <motion.div
              key={2}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="mt-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <HeartCrack className="h-5 w-5 text-rose-500" />
                  <p className="text-base font-semibold text-rose-700">
                    {labelOf(selectedProvider)} 연동을 해제하시겠습니까?
                  </p>
                </div>
                <p className="text-sm text-neutral-700 mb-4 text-center">
                  해제 후에는 해당 소셜 계정으로 로그인할 수 없습니다.
                </p>
                <div className="flex justify-center gap-3">
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 h-10 rounded-full text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition"
                    onClick={() => setConfirmOpen(true)}
                  >
                    해제 확인
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="px-6 h-10 rounded-full border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50 transition"
                    onClick={() => {
                      setConfirmOpen(false);
                      setStep(1);
                    }}
                  >
                    취소
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 스텝 3: 완료 */}
          {step === 3 && (
            <motion.div
              key={3}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-5 flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-sm border border-neutral-200"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
              <h3 className="text-2xl font-bold text-emerald-700 mb-2">
                소셜 연동이 해제되었습니다.
              </h3>
              <p className="text-sm text-neutral-600 mb-1">{resultMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 확인 모달 */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="연동 해제 확인"
        message={`${labelOf(selectedProvider)} 연동을 해제하시겠습니까?\n해제 후에는 해당 소셜로 로그인할 수 없습니다.`}
        confirmText="해제"
        cancelText="닫기"
        danger
        onConfirm={doUnlink}
      />

      <Toast list={toasts} remove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
