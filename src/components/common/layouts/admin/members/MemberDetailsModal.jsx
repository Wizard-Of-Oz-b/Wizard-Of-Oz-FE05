import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import RoleBadge from "./RoleBadge";

const inputBase =
  "h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm";
const textareaBase =
  "min-h-[120px] w-full rounded-xl bg-gray-50 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm resize-y";

export default function MemberDetailsModal({ open, onClose, member, onSave }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    birthday: "",
    role: "customer",
  });

  useEffect(() => {
    if (!member) return;
    setForm({
      name: member.name || "",
      phone: member.phone || "",
      address: member.address || "",
      birthday: member.birthday || "",
      role: member.role || "customer",
    });
  }, [member]);

  if (!member) return null;

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-4xl">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-2xl font-bold text-gray-900">회원 상세보기</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              <span className="font-medium text-gray-700">{member.name}</span>{" "}
              · <span className="text-gray-600">{member.email}</span>
            </p>
          </div>
          <RoleBadge role={form.role} />
        </div>

        {/* Form */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <section className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-100 p-5">
              <h4 className="font-semibold mb-4">기본 정보</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1.5">이름</div>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={inputBase}
                  />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1.5">연락처</div>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className={inputBase}
                  />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1.5">아이디(이메일)</div>
                  <input value={member.email} disabled className={`${inputBase} opacity-70`} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1.5">생년월일</div>
                  <input
                    type="date"
                    value={form.birthday}
                    onChange={(e) => setForm((f) => ({ ...f, birthday: e.target.value }))}
                    className={inputBase}
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="text-xs text-gray-500 mb-1.5">주소</div>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    className={textareaBase}
                    placeholder="도로명 주소, 상세 주소"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 p-5">
              <h4 className="font-semibold mb-4">권한/등급</h4>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1.5">등급</div>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className={`${inputBase} h-11`}
                  >
                    <option value="superadmin">슈퍼관리자</option>
                    <option value="page_admin">페이지관리자</option>
                    <option value="cs_admin">CS관리자</option>
                    <option value="customer">일반고객</option>
                  </select>
                </div>

                <div className="rounded-xl bg-violet-50 text-violet-800 text-sm p-3">
                  등급 변경 시, 일부 관리자 메뉴 접근 권한이 달라질 수 있습니다.
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-end gap-2">
          <button onClick={onClose} className="h-11 rounded-xl px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
            닫기
          </button>
          <button onClick={() => onSave(member.id, form)} className="h-11 rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white hover:bg-violet-700">
            저장
          </button>
        </div>
      </div>
    </Modal>
  );
}