import FieldLabel from "./FieldLabel";

export default function BasicInfo({ form, set }) {
  return (
    <section className="lg:col-span-2">
      <div className="rounded-2xl border border-gray-100 p-5 space-y-4">
        <div>
          <FieldLabel>상품 ID (SKU)</FieldLabel>
          <input
            value={form.id}
            onChange={(e) => set("id", e.target.value)}
            placeholder="예: E481044-000"
            className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
          />
        </div>

        <div>
          <FieldLabel>SKU</FieldLabel>
          <input
            value={form.sku}
            onChange={(e) => set("sku", e.target.value)}
            placeholder="예: TSHIRT001"
            className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
          />
        </div>

        <div>
          <FieldLabel>상품명</FieldLabel>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="예: 블록테크 파카"
            className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>가격(원)</FieldLabel>
            <input
              type="number"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
            />
          </div>
          <div>
            <FieldLabel>판매 상태</FieldLabel>
            <select
              value={form.is_available ? "y" : "n"}
              onChange={(e) => set("is_available", e.target.value === "y")}
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
            >
              <option value="y">판매중</option>
              <option value="n">중지</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>카테고리</FieldLabel>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
            >
              <option value="상의">상의</option>
              <option value="하의">하의</option>
              <option value="아우터">아우터</option>
              <option value="ACC">ACC</option>
            </select>
          </div>
          <div>
            <FieldLabel>대표 썸네일 URL</FieldLabel>
            <input
              value={form.image_url}
              onChange={(e) => set("image_url", e.target.value)}
              placeholder="https://…"
              className="h-11 w-full rounded-xl bg-gray-50 px-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
