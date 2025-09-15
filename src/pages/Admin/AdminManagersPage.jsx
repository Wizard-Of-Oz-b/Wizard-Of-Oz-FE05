import React, { useEffect, useMemo, useState } from "react";
import { Shield, Plus, Trash2, RefreshCcw, Edit3, Crown, UsersRound, UserRound } from "lucide-react";
import api from "../../lib/axios";
import Toast from "../../components/common/layouts/admin/manager/ui/Toast";
import Modal from "../../components/common/layouts/admin/manager/ui/Modal";
import AdminManagersTable from "../../components/common/layouts/admin/manager/AdminManagersTable";

export default function AdminManagersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [toastMsg, setToastMsg] = useState("");
  const [toastKind, setToastKind] = useState("info");

  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("manager");
  const [submitting, setSubmitting] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editRole, setEditRole] = useState("manager");
  const [editSaving, setEditSaving] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirmWorking, setConfirmWorking] = useState(false);

  function showToast(message, kind = "info") {
    setToastMsg(message);
    setToastKind(kind);
  }

  async function fetchAdmins() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/v1/admins/");
      setItems(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      const code = e?.response?.status;
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : "") ||
        e?.message ||
        "관리자 목록을 불러오지 못했습니다.";
      setErr(code ? `[${code}] ${msg}` : msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function handleGrant(e) {
    e.preventDefault();
    if (!userId || !role) return;
    setSubmitting(true);
    setErr("");
    try {
      await api.post("/v1/admins/", { user_id: Number(userId), role });
      setUserId("");
      showToast("관리자 권한이 부여되었습니다.", "success");
      await fetchAdmins();
    } catch (e) {
      const code = e?.response?.status;
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : "") ||
        e?.message ||
        "관리자 부여에 실패했습니다.";
      setErr(code ? `[${code}] ${msg}` : msg);
      showToast("관리자 부여 실패", "error");
    } finally {
      setSubmitting(false);
    }
  }

  function openEdit(row) {
    setEditTarget(row);
    setEditRole(row.role || "manager");
    setEditOpen(true);
  }

  async function saveEdit() {
    if (!editTarget?.admin_id) return;
    setEditSaving(true);
    try {
      await api.patch(`/v1/admins/${editTarget.admin_id}/`, { role: editRole });
      setEditOpen(false);
      showToast("권한이 변경되었습니다.", "success");
      await fetchAdmins();
    } catch (e) {
      const code = e?.response?.status;
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : "") ||
        e?.message ||
        "권한 변경에 실패했습니다.";
      setErr(code ? `[${code}] ${msg}` : msg);
      showToast("권한 변경 실패", "error");
    } finally {
      setEditSaving(false);
    }
  }

  function openRevoke(row) {
    setConfirmTarget(row);
    setConfirmOpen(true);
  }

  async function confirmRevoke() {
    if (!confirmTarget?.admin_id) return;
    setConfirmWorking(true);
    try {
      await api.delete(`/v1/admins/${confirmTarget.admin_id}/`);
      setConfirmOpen(false);
      showToast("관리자 권한이 해제되었습니다.", "success");
      await fetchAdmins();
    } catch (e) {
      const code = e?.response?.status;
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : "") ||
        e?.message ||
        "관리자 해제에 실패했습니다.";
      setErr(code ? `[${code}] ${msg}` : msg);
      showToast("관리자 해제 실패", "error");
    } finally {
      setConfirmWorking(false);
    }
  }

  const rows = useMemo(() => items || [], [items]);

  return (
    <div className="w-full mx-auto max-w-8xl p-5">
      <Toast message={toastMsg} kind={toastKind} onClose={() => setToastMsg("")} />

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_10px_30px_-15px_rgba(124,58,237,.7)]"
            style={{ background: "conic-gradient(from 130deg at 50% 50%, #7c3aed, #ec4899, #7c3aed)" }}
          >
            <Shield className="size-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-700 to-fuchsia-600 text-transparent bg-clip-text">
              관리자 계정 관리
            </h1>
            <p className="text-[12px] uppercase tracking-widest text-slate-500">Admins Management</p>
          </div>
        </div>
        <button
          onClick={fetchAdmins}
          className="inline-flex items-center gap-2 rounded-xl bg-white/80 backdrop-blur border border-black/10 px-3 py-2 text-sm hover:bg-white shadow-sm"
        >
          <RefreshCcw className="w-4 h-4" />
          새로고침
        </button>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl bg-white/80 backdrop-blur border border-black/5 shadow-sm p-4">
          <div className="text-xs text-slate-500 mb-1">총 관리자 수</div>
          <div className="flex items-end gap-2">
            <div className="text-2xl font-extrabold text-slate-800">{rows.length}</div>
            <div className="text-[11px] text-slate-400">accounts</div>
          </div>
        </div>
        <div className="rounded-2xl bg-white/80 backdrop-blur border border-black/5 shadow-sm p-4">
          <div className="text-xs text-slate-500 mb-1">슈퍼 관리자</div>
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <div className="text-slate-800 font-semibold">{rows.filter((r) => r.role === "super").length}</div>
          </div>
        </div>
        <div className="rounded-2xl bg-white/80 backdrop-blur border border-black/5 shadow-sm p-4">
          <div className="text-xs text-slate-500 mb-1">매니저 & CS</div>
          <div className="flex items-center gap-2">
            <UsersRound className="w-4 h-4 text-violet-500" />
            <div className="text-slate-800 font-semibold">{rows.filter((r) => r.role !== "super").length}</div>
          </div>
        </div>
      </div>

      {/* 권한부여 폼 */}
      <div className="mb-6 rounded-2xl bg-white/80 backdrop-blur border border-black/5 shadow-sm p-5">
        <form onSubmit={handleGrant} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">User ID</label>
            <div className="relative">
              <UserRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                min="1"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="예: 3"
                className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="manager">manager</option>
              <option value="cs">cs</option>
              <option value="super">super</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 h-11 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              관리자 부여
            </button>
          </div>
        </form>
        <p className="mt-2 text-[12px] text-slate-500">
          사용자 목록 API가 없으므로 <b>User ID</b>를 직접 입력하세요. (Django Admin에서 확인)
        </p>
      </div>

      {/* 목록 */}
        <AdminManagersTable
            rows={rows}
            loading={loading}
            onEdit={openEdit}
            onRevoke={openRevoke}
        />

      {/* 권한변경 모달 */}
      <Modal
        open={editOpen}
        title="권한 변경"
        onClose={() => setEditOpen(false)}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setEditOpen(false)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
              disabled={editSaving}
            >
              취소
            </button>
            <button
              onClick={saveEdit}
              className="rounded-lg bg-violet-600 text-white px-3 py-2 text-sm hover:bg-violet-500 disabled:opacity-50"
              disabled={editSaving}
            >
              저장
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="text-sm text-slate-700">
            Admin ID: <b>{editTarget?.admin_id}</b>, User ID: <b>{editTarget?.user_id}</b>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Role</label>
            <select
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="manager">manager</option>
              <option value="cs">cs</option>
              <option value="super">super</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* 해제 확인 모달 */}
      <Modal
        open={confirmOpen}
        title="관리자 해제"
        onClose={() => setConfirmOpen(false)}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setConfirmOpen(false)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
              disabled={confirmWorking}
            >
              취소
            </button>
            <button
              onClick={confirmRevoke}
              className="rounded-lg bg-rose-600 text-white px-3 py-2 text-sm hover:bg-rose-500 disabled:opacity-50"
              disabled={confirmWorking}
            >
              해제
            </button>
          </div>
        }
      >
        <p className="text-sm text-slate-700">
          Admin ID <b>{confirmTarget?.admin_id}</b> (User {confirmTarget?.user_id})의 권한을 해제할까요?
        </p>
      </Modal>

      <Toast message={toastMsg} kind={toastKind} onClose={() => setToastMsg("")} />
    </div>
  );
}