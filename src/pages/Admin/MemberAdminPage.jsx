import React, { useEffect, useMemo, useState } from "react";
import { Users } from "lucide-react";
import { mockMembers as initialMembers } from "../../components/features/admin/member/mockMembers";

import {
  IconButton,
  Modal,
  RoleBadge,
  MemberDetailsModal,
  MembersFilters,
  MembersTable,
  Pagination,
} from "../../components/common/layouts/admin/members";

export default function MemberAdminPage() {
  const PAGE_SIZE = 10;
  const [members, setMembers] = useState(initialMembers);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const selectedMember = useMemo(
    () => members.find((m) => m.id === selectedMemberId) || null,
    [members, selectedMemberId]
  );

  // filtering
  const filtered = members.filter((m) => {
    const matchRole = roleFilter ? m.role === roleFilter : true;
    const text = (m.name + " " + m.email + " " + (m.username || "") + " " + (m.phone || "")).toLowerCase();
    const matchQuery = q ? text.includes(q.toLowerCase()) : true;
    return matchRole && matchQuery;
  });

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goFirst = () => setPage(1);
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(pageCount, p + 1));
  const goLast = () => setPage(pageCount);

  useEffect(() => setPage(1), [q, roleFilter]);

  // save from modal
  const saveMember = (memberId, partial) => {
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
  };

  const openDetail = (id) => {
    setSelectedMemberId(id);
    setDetailOpen(true);
  };

  return (
    <div className="w-full p-5 mx-auto max-w-8xl">
      {/* Header */}
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

      {/* Filters */}
      <MembersFilters q={q} setQ={setQ} roleFilter={roleFilter} setRoleFilter={setRoleFilter} />

      {/* Table */}
      <MembersTable rows={pageData} onOpenDetail={openDetail} />

      {/* Pagination */}
      <Pagination page={page} pageCount={pageCount} goFirst={goFirst} goPrev={goPrev} goNext={goNext} goLast={goLast} />

      {/* Detail Modal */}
      <MemberDetailsModal open={detailOpen} onClose={() => setDetailOpen(false)} member={selectedMember} onSave={saveMember} />
    </div>
  );
}