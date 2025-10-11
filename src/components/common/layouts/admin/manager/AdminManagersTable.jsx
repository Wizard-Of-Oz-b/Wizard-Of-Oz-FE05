import EmptyState from "./EmptyState";
import AdminManagerRow from "./AdminManagerRow";

export default function AdminManagersTable({ rows = [], loading, onEdit, onRevoke }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/80 backdrop-blur border border-black/5 shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50/70 border-b border-black/5">
          <tr className="text-left text-slate-500">
            <th className="px-5 py-3">Admin ID</th>
            <th className="px-5 py-3">User</th>
            <th className="px-5 py-3">Role</th>
            <th className="px-5 py-3 w-48">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-black/5">
                {Array.from({ length: 4 }).map((__, j) => (
                  <td key={j} className="px-5 py-3">
                    <div className="h-4 w-28 bg-slate-200/70 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={4}>
                <EmptyState
                  title="등록된 관리자가 없습니다."
                  desc="상단의 '관리자 부여'에서 사용자에게 권한을 부여해 보세요."
                />
              </td>
            </tr>
          ) : (
            rows.map((it) => (
              <AdminManagerRow key={it.admin_id} item={it} onEdit={onEdit} onRevoke={onRevoke} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}