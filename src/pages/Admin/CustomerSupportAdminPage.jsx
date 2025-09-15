import React, { useEffect, useMemo, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import {
  StatusBadge,
  PriorityBadge,
  TicketDetailModal,
  IconButton,
  CustomerSupportTable,
  FilterBar,
  Pagination,
} from '../../components/common/layouts/admin/cs';
import { mockTickets } from '../../components/features/admin/cs/mockTickets';

export default function CustomerSupportAdminPage() {
  const PAGE_SIZE = 8;

  const [tickets, setTickets] = useState(mockTickets);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');   // 상태 : 전체/열림/대기/답변완료/종료
  const [priorityFilter, setPriorityFilter] = useState(''); // 우선순위 : 전체/낮음/보통/높음
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [page, setPage] = useState(1);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // 날짜 퀵 세트
  const pad2 = (n) => String(n).padStart(2, '0');
  const toYMD = (d) =>
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  const today = toYMD(new Date());
  const setToday = () => {
    setStartDate(today);
    setEndDate(today);
  };
  const resetDates = () => {
    setStartDate('');
    setEndDate('');
  };

  // 필터링
  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return tickets.filter((t) => {
      const byKw =
        !kw ||
        t.code.toLowerCase().includes(kw) ||
        t.subject.toLowerCase().includes(kw) ||
        t.customer.name.toLowerCase().includes(kw) ||
        t.customer.email.toLowerCase().includes(kw);

      const byStatus = !statusFilter || t.status === statusFilter;
      const byPriority = !priorityFilter || t.priority === priorityFilter;

      let byDate = true;
      if (startDate || endDate) {
        const ts = new Date(t.created_at.replace(' ', 'T'));
        if (startDate && ts < new Date(startDate)) byDate = false;
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (ts > end) byDate = false;
        }
      }

      return byKw && byStatus && byPriority && byDate;
    });
  }, [tickets, q, statusFilter, priorityFilter, startDate, endDate]);

  // 페이징
  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [q, statusFilter, priorityFilter, startDate, endDate]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  // 액션
  const openDetail = (t) => {
    setSelected(t);
    setDetailOpen(true);
  };

  const changeStatus = (id, next) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: next } : t))
    );
    setSelected((s) => (s && s.id === id ? { ...s, status: next } : s));
  };

  const assignAgent = (id, agent) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, assignee: agent } : t))
    );
    setSelected((s) => (s && s.id === id ? { ...s, assignee: agent } : s));
  };

  const addTag = (id, tag) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, tags: Array.from(new Set([...(t.tags || []), tag])) }
          : t
      )
    );
    setSelected((s) =>
      s && s.id === id
        ? { ...s, tags: Array.from(new Set([...(s.tags || []), tag])) }
        : s
    );
  };

  const removeTag = (id, tag) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, tags: (t.tags || []).filter((x) => x !== tag) }
          : t
      )
    );
    setSelected((s) =>
      s && s.id === id
        ? { ...s, tags: (s.tags || []).filter((x) => x !== tag) }
        : s
    );
  };

  const addNote = (id, text) => {
    const note = {
      id: 'n' + Date.now(),
      author: '관리자',
      at: new Date().toLocaleString(),
      text,
    };
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, internal_notes: [...(t.internal_notes || []), note] }
          : t
      )
    );
    setSelected((s) =>
      s && s.id === id
        ? { ...s, internal_notes: [...(s.internal_notes || []), note] }
        : s
    );
  };

  const replyTicket = (id, text, markDone) => {
    const msg = {
      id: 'm' + Date.now(),
      role: 'agent',
      name: '관리자',
      at: new Date().toLocaleString(),
      text,
    };
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              messages: [...t.messages, msg],
              status: markDone ? '답변완료' : t.status,
            }
          : t
      )
    );
    setSelected((s) =>
      s && s.id === id
        ? {
            ...s,
            messages: [...s.messages, msg],
            status: markDone ? '답변완료' : s.status,
          }
        : s
    );
  };

  return (
    <div className="w-full p-5 mx-auto max-w-8xl">
      {/* 헤더 */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg">
            <MessageSquare className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-violet-700 tracking-tight">
              문의 관리
            </h1>
            <p className="text-sm uppercase tracking-widest text-gray-400">
              Customer Support
            </p>
          </div>
        </div>
      </div>

      {/* 필터 바 */}
      <FilterBar
        q={q}
        onChangeQ={setQ}
        statusFilter={statusFilter}
        onChangeStatus={setStatusFilter}
        priorityFilter={priorityFilter}
        onChangePriority={setPriorityFilter}
        startDate={startDate}
        onChangeStart={setStartDate}
        endDate={endDate}
        onChangeEnd={setEndDate}
        onQuickToday={() => {
          setStartDate(today);
          setEndDate(today);
        }}
        onQuickReset={() => {
          setStartDate('');
          setEndDate('');
        }}
      />

      {/* 테이블 */}
      <CustomerSupportTable pageData={pageData} onOpenDetail={openDetail} />

      {/* 페이지네이션 */}
      <Pagination
        page={page}
        pageCount={pageCount}
        onChange={(next) => {
          const clamped = Math.min(Math.max(1, next), pageCount);
          setPage(clamped);
        }}
        className="mt-6"
      />

      {/* 문의 상세 모달 */}
      <TicketDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        ticket={selected}
        onReply={replyTicket}
        onChangeStatus={changeStatus}
        onAssign={assignAgent}
        onAddTag={addTag}
        onRemoveTag={removeTag}
        onAddNote={addNote}
      />
    </div>
  );
}
