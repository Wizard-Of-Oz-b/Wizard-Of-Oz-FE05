export default function MembersFilters({ q, setQ, roleFilter, setRoleFilter }) {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-3 items-center justify-between rounded-2xl bg-white/90 shadow-md backdrop-blur-md p-4">
      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="h-10 min-w-40 rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
      >
        <option value="">등급: 전체</option>
        <option value="superadmin">슈퍼관리자</option>
        <option value="page_admin">페이지관리자</option>
        <option value="cs_admin">CS관리자</option>
        <option value="customer">일반고객</option>
      </select>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="이름 / 이메일 / 아이디 / 연락처 검색…"
        className="h-10 rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 w-full md:max-w-xs border-0 shadow-sm"
      />
    </div>
  );
}