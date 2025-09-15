// 가입회원 전체를 볼 수 있는 api가 없어서 보류

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Users } from "lucide-react";
import api from "../../lib/axios";
import { mockMembers as fallbackMembers } from "../../components/features/admin/member/mockMembers";

import {
  MembersFilters,
  MembersTable,
  Pagination,
  MemberDetailsModal,
} from "../../components/common/layouts/admin/members";

export default function MemberAdminPage() {
  const PAGE_SIZE = 10;

  // 서버 목록
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI 상태
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // 상세 모달
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  async function fetchMembers() {
    setLoading(true);
    setError("");
    try {
      const params = {
        q: q || undefined,
        role: roleFilter || undefined,
        page,
        page_size: PAGE_SIZE,
      };
      const res = await api.get("/v1/users/", { params });

      if (Array.isArray(res?.data?.results)) {
        setMembers(res.data.results || []);
      } else if (Array.isArray(res?.data)) {
        setMembers(res.data);
      } else {
        setMembers([]);
      }
    } catch (e) {
      const code = e?.response?.status;
      if (code === 404) {
        setMembers(fallbackMembers);
        setError("서버에 회원 목록 API가 없어 목데이터로 표시합니다.");
      } else {
        const msg =
          e?.response?.data?.detail ||
          e?.response?.data?.message ||
          (typeof e?.response?.data === "string" ? e.response.data : "") ||
          e?.message ||
          "회원 목록을 불러오지 못했습니다.";
        setError(code ? `[${code}] ${msg}` : msg);
        setMembers([]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, [q, roleFilter, page]);

  const filtered = useMemo(() => {
    return (members || []).filter((m) => {
      const matchRole = roleFilter
        ? String(m.role || "").toLowerCase() === String(roleFilter).toLowerCase()
        : true;
      const text = [m.name, m.email, m.username, m.phone]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchQuery = q ? text.includes(q.toLowerCase()) : true;
      return matchRole && matchQuery;
    });
  }, [members, q, roleFilter]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageData = useMemo(() => {
    if (filtered.length > PAGE_SIZE) {
      return filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    }
    return filtered;
  }, [filtered, page]);

  useEffect(() => setPage(1), [q, roleFilter]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const selectedMember = useMemo(
    () => pageData.find((m) => m.id === selectedMemberId) || null,
    [pageData, selectedMemberId]
  );

  const openDetail = (id) => {
    setSelectedMemberId(id);
    setDetailOpen(true);
  };

  const saveMember = async (memberId, partial) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              name: partial.name?.trim() ?? m.name,
              phone: partial.phone?.trim() ?? m.phone,
              address: partial.address?.trim() ?? m.address,
              birthday: partial.birthday ?? m.birthday,
              role: partial.role ?? m.role,
            }
          : m
      )
    );
    setDetailOpen(false);

    try {
      // await api.patch(`/v1/users/${memberId}/`, { ...partial }); 확장을 위해 보류
    } catch (e) {
      console.error("회원 수정 실패:", e);
    }
  };

  const goFirst = useCallback(() => setPage(1), []);
  const goPrev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goNext = useCallback(
    () => setPage((p) => Math.min(pageCount, p + 1)),
    [pageCount]
  );
  const goLast = useCallback(() => setPage(pageCount), [pageCount]);

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

      {/* 상태 표시 */}
      {loading && (
        <div className="mb-4 rounded-lg bg-white p-4 shadow border border-gray-200 text-sm text-gray-600">
          목록을 불러오는 중입니다…
        </div>
      )}
      {!!error && (
        <div className="mb-4 rounded-lg bg-amber-50 p-4 shadow border border-amber-200 text-sm text-amber-700">
          {error}
        </div>
      )}

      {/* 필터 */}
      <MembersFilters
        q={q}
        setQ={setQ}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      {/* 테이블 */}
      <MembersTable rows={pageData} onOpenDetail={openDetail} />

      {/* 페이지네이션 */}
      <Pagination
        page={page}
        pageCount={pageCount}
        goFirst={goFirst}
        goPrev={goPrev}
        goNext={goNext}
        goLast={goLast}
      />

      {/* 상세 모달 */}
      <MemberDetailsModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        member={selectedMember}
        onSave={saveMember}
      />
    </div>
  );
}
