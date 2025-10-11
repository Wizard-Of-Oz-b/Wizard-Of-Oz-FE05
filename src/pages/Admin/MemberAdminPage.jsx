import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Users } from "lucide-react";
import api from "../../lib/axios";
import { mockMembers as fallbackMembers } from "../../components/features/admin/member/mockMembers";

import { MembersFilters, Pagination } from "../../components/common/layouts/admin/members";
import MembersTable from "../../components/common/layouts/admin/members/MembersTable";
import MemberDetailsModal from "../../components/common/layouts/admin/members/MemberDetailsModal";
import RoleEditModal from "../../components/common/layouts/admin/members/RoleEditModal";
import Toast from "../../components/common/layouts/admin/members/Toast";

const ADMIN_API_BASE_RAW = import.meta?.env?.VITE_ADMIN_API_BASE ?? "/v1/admin";
// const USERS_API_BASE_RAW = import.meta?.env?.VITE_USERS_API_BASE ?? "/v1/users";

const join = (base, tail = "") => {
  const b = (api.defaults.baseURL || "").replace(/\/+$/, "");
  let p = `${(base || "").replace(/\/+$/, "")}${tail}`;
  if (b.endsWith("/api") && p.startsWith("/api/")) p = p.replace(/^\/api\//, "/");
  return p;
};

export default function MemberAdminPage() {
  const PAGE_SIZE = 10;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState(q);
  const [roleFilter, setRoleFilter] = useState("");
  const [ordering] = useState("-created_at");

  // Toast
  const [toastMsg, setToastMsg] = useState("");
  const [toastKind, setToastKind] = useState("info");

  // 상세/권한 모달
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  const normalize = (u) => ({
    id: u.user_id ?? u.id,
    email: u.email ?? "",
    role: u.role ?? "user",
    status: u.status ?? "",
    is_active: Boolean(u.is_active),
    created_at: u.created_at ?? "",
    name: u.name ?? u.nickname ?? u.username ?? (u.email ? u.email.split("@")[0] : ""),
    phone: u.phone ?? u.phone_number ?? "",
    address: u.address ?? "",
    birthday: u.birthday ?? "",
  });

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  async function fetchMembers() {
    setLoading(true);
    setError("");
    try {
      const params = { search: debouncedQ || undefined, ordering: ordering || undefined };
      const res = await api.get(join(ADMIN_API_BASE_RAW, "/users/"), { params });
      const raw = Array.isArray(res?.data?.results) ? res.data.results
                : Array.isArray(res?.data) ? res.data : [];
      const list = raw.map(normalize);
      setMembers(list);
      hydrateMissingDetails(list).catch(() => {});
    } catch (e) {
      const code = e?.response?.status;
      if (code === 404) {
        setMembers((fallbackMembers || []).map(normalize));
        setError("서버 목록 API 미구현으로 목데이터를 표시합니다.");
      } else {
        const msg =
          e?.response?.data?.detail ||
          e?.response?.data?.message ||
          (typeof e?.response?.data === "string" ? e.response.data : "") ||
          e?.message || "회원 목록을 불러오지 못했습니다.";
        setError(code ? `[${code}] ${msg}` : msg);
        setMembers([]);
      }
    } finally {
      setLoading(false);
    }
  }

  async function hydrateMissingDetails(list) {
    const targets = list.filter((m) => !m.phone || !m.address || !m.birthday);
    for (const t of targets) {
      let fresh = null;
      try {
        const { data } = await api.get(join(ADMIN_API_BASE_RAW, `/users/${t.id}/`));
        fresh = normalize({ ...t, ...data });
      } catch {}
      if (!fresh || !fresh.phone || !fresh.address || !fresh.birthday) {
        try {
          const { data: prof } = await api.get(join(USERS_API_BASE_RAW, `/${t.id}/`));
          fresh = normalize({ ...(fresh || t), ...prof });
        } catch {}
      }
      if (fresh) setMembers((prev) => prev.map((m) => (m.id === t.id ? { ...m, ...fresh } : m)));
    }
  }

  useEffect(() => {
    fetchMembers();
  }, [debouncedQ]);

  const filtered = useMemo(() => {
    return (members || []).filter((m) => {
      const matchRole = roleFilter ? String(m.role || "").toLowerCase() === String(roleFilter).toLowerCase() : true;
      const text = [m.name, m.email, m.phone].filter(Boolean).join(" ").toLowerCase();
      const matchQuery = debouncedQ ? text.includes(debouncedQ.toLowerCase()) : true;
      return matchRole && matchQuery;
    });
  }, [members, debouncedQ, roleFilter]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageData = useMemo(() => {
    if (filtered.length > PAGE_SIZE) {
      return filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    }
    return filtered;
  }, [filtered, page]);

  useEffect(() => setPage(1), [debouncedQ, roleFilter]);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);

  // 상세
  async function openDetail(id) {
    try {
      const { data } = await api.get(join(ADMIN_API_BASE_RAW, `/users/${id}/`));
      let fresh = normalize(data);
      if (!fresh.phone || !fresh.address || !fresh.birthday) {
        try {
          const { data: profile } = await api.get(join(USERS_API_BASE_RAW, `/${id}/`));
          fresh = normalize({ ...fresh, ...profile });
        } catch {}
      }
      setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...fresh } : m)));
    } catch {}
    setSelectedMemberId(id);
    setDetailOpen(true);
  }

  // 권한 변경
  const openRole = (id) => {
    const u = members.find((m) => m.id === id);
    if (!u) return;
    setEditTarget(u);
    setEditOpen(true);
  };

  const uiToApiRole = {
    superadmin: "admin",
    page_admin: "manager",
    cs_admin: "cs",
    customer: "user",
    admin: "admin",
    manager: "manager",
    cs: "cs",
    user: "user",
  };

  async function updateUserRole(userId, newRoleUI) {
    const role = uiToApiRole[newRoleUI] ?? newRoleUI;
    const { data } = await api.patch(join(ADMIN_API_BASE_RAW, `/users/${userId}/role/`), { role });
    return data?.role ?? role;
  }

  async function saveEditRole(newRole) {
    if (!editTarget) return;
    try {
      setEditSaving(true);
      const confirmed = await updateUserRole(editTarget.id, newRole);
      setMembers((list) => list.map((m) => (m.id === editTarget.id ? { ...m, role: confirmed } : m)));
      setToastKind("success");
      setToastMsg("권한이 변경되었습니다.");
      setEditOpen(false);
    } catch {
      setToastKind("error");
      setToastMsg("권한 변경에 실패하였습니다.");
    } finally {
      setEditSaving(false);
    }
  }

  const goFirst = useCallback(() => setPage(1), []);
  const goPrev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goNext = useCallback(() => setPage((p) => Math.min(pageCount, p + 1)), [pageCount]);
  const goLast = useCallback(() => setPage(pageCount), [pageCount]);

  const selectedMember = useMemo(
    () => pageData.find((m) => m.id === selectedMemberId) || null,
    [pageData, selectedMemberId]
  );

  return (
    <div className="w-full p-5 mx-auto max-w-8xl">
      {/* 헤더 */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg">
            <Users className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-violet-700 tracking-tight">회원 관리</h1>
            <p className="text-sm uppercase tracking-widest text-gray-400">Member Management</p>
          </div>
        </div>
      </div>
      {/* 필터 */}
      <MembersFilters q={q} setQ={setQ} roleFilter={roleFilter} setRoleFilter={setRoleFilter} />
      {/* 테이블 */}
      <MembersTable
        rows={pageData}
        loading={loading}
        pageSize={PAGE_SIZE}
        onOpenDetail={openDetail}
        onOpenRole={openRole}
      />
      {/* 페이지네이션 */}
      <Pagination page={page} pageCount={pageCount} goFirst={goFirst} goPrev={goPrev} goNext={goNext} goLast={goLast} />
      {/* 상세 모달 */}
      <MemberDetailsModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        member={selectedMember}
      />
      {/* 권한 변경 모달 */}
      <RoleEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={editTarget}
        saving={editSaving}
        onSave={saveEditRole}
        allowedRoles={["admin","manager","cs","user"]}
      />

      {/* Toast */}
      <Toast message={toastMsg} kind={toastKind} onClose={() => setToastMsg("")} />
    </div>
  );
}
