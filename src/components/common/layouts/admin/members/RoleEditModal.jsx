import React, { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";
import RoleBadge from "./RoleBadge";
import {
  Crown,
  ShieldCheck,
  Headset,
  UserRound,
  Info,
  Mail,
  Calendar,
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

// 라벨 텍스트
const LABEL = {
  admin: "Admin (슈퍼관리자)",
  manager: "Manager (페이지관리자)",
  cs: "CS (CS관리자)",
  user: "User (일반고객)",
};

// 역할 정보
const ROLE_META = {
  admin: { icon: Crown,  desc: "모든 설정 접근, 권한 부여 가능", tint: "violet" },
  manager: { icon: ShieldCheck, desc: "상품/페이지 관리 권한",     tint: "indigo" },
  cs: { icon: Headset, desc: "주문/문의 처리 권한",               tint: "sky" },
  user: { icon: UserRound, desc: "일반 쇼핑 기능",                 tint: "slate" },
};

// tailwind 동적 클래스 안전 매핑
const TINT = {
  violet: { iconBg: "bg-violet-100", iconText: "text-violet-700" },
  indigo: { iconBg: "bg-indigo-100", iconText: "text-indigo-700" },
  sky:    { iconBg: "bg-sky-100",    iconText: "text-sky-700"    },
  slate:  { iconBg: "bg-slate-100",  iconText: "text-slate-700"  },
};

export default function RoleEditModal({
  open,
  onClose,
  user,
  saving = false,
  onSave,
  allowedRoles = ["admin", "manager", "cs", "user"],
}) {
  const [role, setRole] = useState(user?.role || "user");

  useEffect(() => {
    setRole(user?.role || "user");
  }, [user]);

  const options = useMemo(
    () => allowedRoles.filter((r) => LABEL[r]),
    [allowedRoles]
  );

  if (!user) return null;

  const displayName =
    user?.name || user?.nickname || user?.username || (user?.email ? user.email.split("@")[0] : "(이름 없음)");

const createdAt = user?.created_at
  ? dayjs(user.created_at).format("YYYY년 MM월 DD일 HH시 mm분")
  : "—";

  const initials =
    (displayName || user?.email || "?").trim().charAt(0).toUpperCase() || "?";

  const handleSave = () => onSave?.(role);

  return (
    <Modal
      open={open}
      onClose={onClose}
      showTopBar={false}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
            disabled={saving}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
            disabled={saving}
          >
            {saving && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            저장
          </button>
        </div>
      }
    >
      <div className="mb-5">
        <div className="flex items-start gap-4">
          {/* 아바타 */}
          <div className="grid h-12 w-12 place-items-center rounded-xl 
                          bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-600 
                          text-white shadow-lg ring-4 ring-violet-100 shrink-0">
            <span className="text-base font-bold">{initials}</span>
          </div>

          {/* 텍스트 영역 */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold tracking-tight text-slate-900 truncate">
                {displayName}
              </h3>
              <RoleBadge role={user?.role} />
            </div>

            {/* 보조 정보 */}
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                {user?.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-violet-500" />
                가입일: {createdAt}
              </span>
            </div>
          </div>
        </div>

        {/* 헤더와 본문 사이 구분선 */}
        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-violet-200 to-transparent" />
      </div>

      {/* 권한 선택 섹션 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold tracking-wide text-slate-500">
            부여할 권한을 선택해주세요.
          </label>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {options.map((r) => {
            const meta = ROLE_META[r] || ROLE_META.user;
            const Icon = meta.icon || UserRound;
            const picked = role === r;
            const tint = TINT[meta.tint] || TINT.slate;

            const ring = picked ? "ring-2 ring-violet-500" : "ring-1 ring-slate-200";
            const bg = picked ? "bg-violet-50" : "bg-white";

            return (
              <label
                key={r}
                className={[
                  "group relative cursor-pointer rounded-2xl p-4 transition-all duration-150",
                  bg,
                  ring,
                  "hover:shadow-sm",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="role"
                  value={r}
                  className="peer sr-only"
                  checked={picked}
                  onChange={() => setRole(r)}
                  disabled={saving}
                />
                <div className="flex items-start gap-3">
                  <div className={["grid h-10 w-10 place-items-center rounded-xl shadow-inner", tint.iconBg, tint.iconText].join(" ")}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-semibold text-slate-900">
                        {LABEL[r]}
                      </div>
                      {picked && (
                        <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                          선택됨
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{meta.desc}</p>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* 안내 문구 */}
        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 text-slate-500" />
            <p>역할 변경 시 일부 관리자 메뉴 접근 권한이 달라질 수 있습니다.</p>
          </div>
        </div>
      </section>
    </Modal>
  );
}
