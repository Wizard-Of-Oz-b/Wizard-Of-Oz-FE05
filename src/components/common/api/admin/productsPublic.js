import publicApi from "../../../../lib/axiosPublic";

const normalizeProduct = (row = {}) => ({
  id: row.product_id || row.id,
  name: row.name || "",
  price: Number(row.price ?? 0),
  is_active: !!row.is_active,
  category: row.category_id || null,
  category_name: row.category_name || "",
  options: row.options ?? null,
  created_at: row.created_at,
  updated_at: row.updated_at,
  image_url: row.image_url || row.primary_image || null,
});



// export async function fetchProductsPublic(params = {}) {
//   const {
//     q,
//     category_id,
//     is_active = true,
//     sort = "-created_at",
//     page = 1,
//     size = 20,
//     min_price,
//     max_price,
//   } = params;

//   const res = await publicApi.get("/v1/products/", {
//     params: {
//       q: q || undefined,
//       category_id: category_id || undefined,
//       is_active,
//       ordering: sort,      // 예: "-created_at" | "price" | "-price" | "name" | "-name"
//       page,
//       size,
//       min_price,
//       max_price,
//     },
//     headers: { Authorization: undefined }, // 혹시 몰라 한 번 더 차단
//   });

//   const data = res.data || {};
//   const list = Array.isArray(data.results) ? data.results : [];
//   return {
//     count: data.count ?? list.length,
//     results: list.map(normalizeProduct),
//   };
// }

export async function fetchProductsPublic(params = {}) {
  const {
    q,
    category_id,
    is_active = true,
    sort = "-created_at",
    page = 1,
    size = 20,
    min_price,
    max_price,
  } = params;

  const baseParams = {
    q: q || undefined,
    // search: q || undefined,  // ← 잠시 주석
    category_id: category_id || undefined,
    is_active,
    ordering: sort,
    page,
    size,
    min_price: min_price ?? undefined,
    max_price: max_price ?? undefined,
  };

  const call = async (paramsToUse) => {
    try {
      const res = await publicApi.get("/v1/products/", { params: paramsToUse });
      const data = res.data || {};
      const list = Array.isArray(data.results) ? data.results : [];
      return { ok: true, value: {
        count: data.count ?? list.length,
        results: list.map(normalizeProduct),
      }};
    } catch (err) {
      console.error("fetchProductsPublic ERROR", {
        status: err?.response?.status,
        data: err?.response?.data,
        params: paramsToUse,
      });
      return { ok: false, err };
    }
  };

  let r = await call(baseParams);
  if (r.ok) return r.value;

  const p2 = { ...baseParams };
  delete p2.ordering;
  r = await call(p2);
  if (r.ok) return r.value;

  const p3 = { ...p2 };
  delete p3.q;
  r = await call(p3);
  if (r.ok) return r.value;

  throw r.err;
}
