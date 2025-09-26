export default function ProductFilter({ q, setQ, selectedCategory, setSelectedCategory }) {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-3 items-center justify-between rounded-2xl bg-white/90 shadow-md backdrop-blur-md p-4">
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="h-10 min-w-40 rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
      >
        <option value="">카테고리: 전체</option>
        <option value="상의">상의</option>
        <option value="하의">하의</option>
        <option value="아우터">아우터</option>
        <option value="신발">신발</option>
        <option value="악세사리">악세사리</option>
      </select>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="상품명 또는 상품코드를 입력해주세요."
        className="h-10 rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 w-full md:max-w-xs border-0 shadow-sm"
      />
    </div>
  );
}
