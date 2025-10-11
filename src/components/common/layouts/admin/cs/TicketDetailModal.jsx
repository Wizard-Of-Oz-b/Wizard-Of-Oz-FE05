import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import IconButton from "../common/IconButton";
import { MessageSquare, Reply, SendHorizonal, UserRound, Tag, Plus, Check, AlertTriangle } from "lucide-react";
import { mockAgents } from "../../../../features/admin/cs/mockTickets";

export default function TicketDetailModal({
  open,
  onClose,
  ticket,
  onReply,
  onChangeStatus,
  onAssign,
  onAddTag,
  onRemoveTag,
  onAddNote,
}) {
  const [reply, setReply] = useState("");
  const [note, setNote] = useState("");
  const [assignee, setAssignee] = useState(ticket?.assignee || "미지정");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (!ticket) return;
    setReply("");
    setNote("");
    setAssignee(ticket.assignee || "미지정");
    setNewTag("");
  }, [ticket]);

  if (!ticket) return null;

  const canned = [
    "안녕하세요 고객님, 문의 주셔서 감사합니다.",
    "확인 후 회신 드리겠습니다.",
    "불편을 드려 죄송합니다. 최대한 빠르게 처리하겠습니다.",
  ];

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-5xl">
      <div className="p-6 md:p-7">
        {/* 헤더 */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-2xl font-bold text-gray-900">{ticket.subject}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              티켓번호 <span className="font-medium text-gray-700">{ticket.code}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge level={ticket.priority} />
            <div className="ml-2 text-xs text-gray-500">{ticket.created_at}</div>
          </div>
        </div>

        {/* 상단 정보 */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <section className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <UserRound className="size-4" /> 고객정보
              </h4>
              <dl className="text-sm text-gray-700 space-y-1">
                <div className="flex justify-between"><dt className="text-gray-500">이름</dt><dd>{ticket.customer.name}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">이메일</dt><dd>{ticket.customer.email}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">연락처</dt><dd>{ticket.customer.phone}</dd></div>
                <div className="flex justify-between"><dt className="text-gray-500">분류</dt><dd>{ticket.category}</dd></div>
              </dl>

              {/* 담당자/태그 */}
              <div className="mt-4 space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1.5">담당자</div>
                  <select
                    value={assignee}
                    onChange={(e) => {
                      setAssignee(e.target.value);
                      onAssign(ticket.id, e.target.value);
                    }}
                    className="h-10 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
                  >
                    {mockAgents.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1.5">태그</div>
                  <div className="flex flex-wrap gap-2">
                    {ticket.tags.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                        <Tag className="size-3.5" />
                        {t}
                        <button className="ml-1 text-gray-400 hover:text-gray-600" onClick={() => onRemoveTag(ticket.id, t)}>×</button>
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="태그 추가"
                      className="h-9 flex-1 rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
                    />
                    <IconButton title="추가" onClick={() => { if (newTag.trim()) { onAddTag(ticket.id, newTag.trim()); setNewTag(""); } }}>
                      <Plus className="size-4" /> 추가
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>

            {/* 내부 메모 */}
            <div className="mt-5 rounded-2xl border border-gray-100 p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="size-4" /> 내부 메모
              </h4>
              <ul className="space-y-3 text-sm">
                {ticket.internal_notes.map((n) => (
                  <li key={n.id} className="rounded-xl bg-amber-50 px-3 py-2">
                    <div className="text-amber-800">{n.text}</div>
                    <div className="mt-1 text-[11px] text-amber-700">{n.author} · {n.at}</div>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex gap-2">
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="팀원만 보는 메모"
                  className="h-10 flex-1 rounded-xl bg-amber-50 px-3 text-sm outline-none focus:ring-2 focus:ring-amber-200 border-0"
                />
                <IconButton title="메모추가" onClick={() => { if (note.trim()) { onAddNote(ticket.id, note.trim()); setNote(""); } }}>
                  <Check className="size-4" /> 저장
                </IconButton>
              </div>
            </div>
          </section>

          {/* 쓰레드 + 답변 */}
          <section className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-100 p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="size-4" /> 대화
              </h4>
              <div className="space-y-3">
                {ticket.messages.map((m) => (
                  <div key={m.id} className={`rounded-2xl px-4 py-3 ${m.role === "agent" ? "bg-violet-50" : "bg-gray-50"}`}>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap">{m.text}</div>
                    <div className={`mt-1 text-[11px] ${m.role === "agent" ? "text-violet-700" : "text-gray-500"}`}>
                      {m.name} · {m.at}
                    </div>
                  </div>
                ))}
              </div>

              {/* 답변 입력 */}
              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-1.5">빠른 답변</div>
                <div className="flex flex-wrap gap-2">
                  {canned.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setReply((r) => (r ? r + "\n" + c : c))}
                      className="h-8 rounded-lg bg-gray-100 px-2 text-xs text-gray-700 hover:bg-gray-200"
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="고객에게 보낼 답변을 입력하세요."
                  className="mt-2 w-full min-h-[140px] rounded-xl bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border border-gray-200 resize-y"
                />
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      if (!reply.trim()) return;
                      onReply(ticket.id, reply.trim(), false);
                      setReply("");
                    }}
                    className="inline-flex items-center gap-2 h-11 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white hover:bg-violet-700"
                  >
                    <SendHorizonal className="size-4" /> 답변 보내기
                  </button>
                  <button
                    onClick={() => {
                      if (!reply.trim()) return;
                      onReply(ticket.id, reply.trim(), true);
                      setReply("");
                    }}
                    className="inline-flex items-center gap-2 h-11 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    <Reply className="size-4" /> 보내고 완료처리
                  </button>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-gray-500">상태 변경:</span>
                    {["열림", "대기", "답변완료", "종료"].map((s) => (
                      <button
                        key={s}
                        onClick={() => onChangeStatus(ticket.id, s)}
                        className="h-8 rounded-lg px-2 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="h-10 rounded-xl px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
            닫기
          </button>
        </div>
      </div>
    </Modal>
  );
}
