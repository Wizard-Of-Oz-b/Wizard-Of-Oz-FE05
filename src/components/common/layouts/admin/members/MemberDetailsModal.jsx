import React, { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";
import RoleBadge from "./RoleBadge";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Copy,
  CheckCircle2,
  UserRound,
  BadgeCheck,
} from "lucide-react";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ko");

const inputBase =
  "h-11 w-full rounded-xl bg-slate-50 px-3 text-sm outline-none border border-slate-200 shadow-sm read-only:opacity-70";
const textareaBase =
  "min-h-[120px] w-full rounded-xl bg-slate-50 px-3 py-3 text-sm outline-none border border-slate-200 shadow-sm resize-y read-only:opacity-70";

export default function MemberDetailsModal({ open, onClose, member }) {
  const [copied, setCopied] = useState({ email: false, id: false });

  const displayName = useMemo(() => {
    if (!member) return "";
    const nick = member.name || member.nickname || member.username;
    return (nick && nick.trim()) || (member.email ? member.email.split("@")[0] : "(이름 없음)");
  }, [member]);

  const createdAt = member?.created_at
    ? dayjs.utc(member.created_at).tz("Asia/Seoul").format("YYYY년 MM월 DD일 HH시 mm분")
    : "—";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    birthday: "",
    role: "user",
  });

  useEffect(() => {
    if (!member) return;
    setForm({
      name: member.name || member.nickname || member.username || "",
      phone: member.phone || member.phone_number || "",
      address: member.address || "",
      birthday: member.birthday || "",
      role: member.role || "user",
    });
    setCopied({ email: false, id: false });
  }, [member]);

  if (!member) return null;

  const statusText = member.status || (member.is_active ? "active" : "inactive");
  const statusBadge =
    statusText === "active"
      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
      : "bg-slate-100 text-slate-600 ring-1 ring-slate-200";

  const copy = async (key, text) => {
    try {
      await (navigator.clipboard?.writeText(text) ?? Promise.reject());
      setCopied((c) => ({ ...c, [key]: true }));
      setTimeout(() => setCopied((c) => ({ ...c, [key]: false })), 1200);
    } catch {
      const t = document.createElement("textarea");
      t.value = text || "";
      document.body.appendChild(t);
      t.select();
      try {
        document.execCommand("copy");
        setCopied((c) => ({ ...c, [key]: true }));
        setTimeout(() => setCopied((c) => ({ ...c, [key]: false })), 1200);
      } finally {
        document.body.removeChild(t);
      }
    }
  };

  const headerNode = (
  <div className="flex items-start gap-3">
    {/* 아이콘 */}
    <div className="grid h-12 w-12 place-items-center rounded-xl
                    bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-600
                    text-white shadow-lg ring-4 ring-violet-100 shrink-0">
      <UserRound className="h-5 w-5" />
    </div>

    {/* 텍스트 영역 */}
    <div className="min-w-0">
      {/* 이름 + 역할 */}
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-bold tracking-tight text-slate-900 truncate">
          {displayName}
        </h3>
        <RoleBadge role={form.role} />
      </div>

      {/* 이메일 / 가입일 */}
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5 text-slate-400" />
          {member?.email}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-violet-500" />
          가입일: {createdAt}
        </span>
      </div>
    </div>
  </div>
);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="회원 상세"
      header={headerNode}
      maxWidth="max-w-3xl"
      footer={
        <div className="flex items-center justify-end">
          <button
            onClick={onClose}
            className="h-11 rounded-xl px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            닫기
          </button>
        </div>
      }
    >
      {/* 내부 스크롤 컨테이너 */}
      <div className="max-h-[75vh] overflow-y-auto scrollbar-hide pr-1">
        {/* 상단 요약 */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="text-xs text-slate-500 mb-1">상태</div>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${statusBadge}`}>
              {statusText}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="text-xs text-slate-500 mb-1">권한</div>
            <div className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-violet-600" />
              <RoleBadge role={form.role} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="text-xs text-slate-500 mb-1 flex items-center justify-between">
              <span>개인고유번호</span>
              <button
                type="button"
                onClick={() => copy("id", String(member.id ?? ""))}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] hover:bg-slate-50"
                title="UUID 복사"
              >
                {copied.id ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> 복사됨
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> 복사
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-slate-800 break-all">{member.id || "—"}</p>
          </div>
        </div>

        {/* 기본 정보 */}
        <section className="mt-6">
          <div className="rounded-2xl border border-slate-100 p-5">
            <h4 className="mb-4 font-semibold">기본 정보</h4>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* 이름 */}
              <div className="min-w-0">
                <div className="mb-1.5 flex items-center gap-2 text-xs text-slate-500">
                  <UserRound className="h-3.5 w-3.5" /> 이름
                </div>
                <input value={form.name} readOnly className={inputBase} />
              </div>

              {/* 연락처 */}
              <div className="min-w-0">
                <div className="mb-1.5 flex items-center gap-2 text-xs text-slate-500">
                  <Phone className="h-3.5 w-3.5" /> 연락처
                </div>
                <input value={form.phone} readOnly className={inputBase} />
              </div>

              {/* 이메일 + 복사 */}
              <div className="md:col-span-2 min-w-0">
                <div className="mb-1.5 flex items-center gap-2 text-xs text-slate-500">
                  <Mail className="h-3.5 w-3.5" /> 아이디(이메일)
                </div>
                <div className="flex gap-2">
                  <input value={member.email} readOnly className={`${inputBase} flex-1`} />
                  <button
                    type="button"
                    onClick={() => copy("email", member.email || "")}
                    className="inline-flex items-center gap-1.5 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-xs hover:bg-slate-50"
                    title="이메일 복사"
                  >
                    {copied.email ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 복사됨
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> 복사
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 생년월일 */}
              <div className="min-w-0">
                <div className="mb-1.5 flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="h-3.5 w-3.5" /> 생년월일
                </div>
                <input type="date" value={form.birthday} readOnly className={inputBase} />
              </div>

              {/* 주소 */}
              <div className="md:col-span-2 min-w-0">
                <div className="mb-1.5 flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" /> 주소
                </div>
                <textarea
                  value={form.address}
                  readOnly
                  className={textareaBase}
                  placeholder="도로명 주소, 상세 주소"
                />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              ※ 현재 화면은 <span className="font-medium text-slate-600">조회 전용</span>입니다.
            </p>
          </div>
        </section>
      </div>
    </Modal>
  );
}
