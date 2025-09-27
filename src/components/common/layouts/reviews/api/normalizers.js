// export const normalizeReview = (r = {}) => ({
//   review_id: r.review_id ?? r.id ?? null,
//   user_id: r.user_id ?? null,
//   product_id: r.product_id ?? null,
//   rating: Number(r.rating ?? 0),
//   content: r.content ?? "",
//   created_at: r.created_at ?? r.createdAt ?? null,
//   user_name: r.user_name ?? r.userName ?? r.username ?? null,
//   images: Array.isArray(r.images) ? r.images : [],
// });

// export const pickPaged = (data) => {
//   if (data?.items && Array.isArray(data.items.results)) {
//     return {
//       results: data.items.results,
//       count: Number(data.items.count ?? data.count ?? data.items.results.length),
//       next: data.items.next ?? null,
//       previous: data.items.previous ?? null,
//       avg_rating: Number(data.avg_rating ?? 0),
//       raw: data,
//     };
//   }
//   const results = Array.isArray(data) ? data : data?.results || [];
//   return {
//     results,
//     count: Number(data?.count ?? results.length),
//     next: data?.next ?? null,
//     previous: data?.previous ?? null,
//     avg_rating: Number(data?.avg_rating ?? 0),
//     raw: data,
//   };
// };

export const normalizeReview = (r = {}) => {
  const owner_id =
    r.user_id ??
    r.author_id ??
    r?.author?.user_id ??
    r?.user?.user_id ??
    r?.user?.id ??
    null;

  return {
    review_id: r.review_id ?? r.uuid ?? r.id ?? null,
    user_id: owner_id,
    product_id: r.product_id ?? r?.product?.product_id ?? r?.product?.id ?? null,
    rating: Number(r.rating ?? 0),
    content: r.content ?? "",
    created_at: r.created_at ?? r.createdAt ?? null,
    user_name:
      r.user_name ?? r.userName ?? r.username ?? r?.user?.name ?? r?.author?.name ?? null,
    images: Array.isArray(r.images) ? r.images : [],
    raw_user: r.user ?? r.author ?? null,
  };
};

export const pickPaged = (data) => {
  if (data?.items && Array.isArray(data.items.results)) {
    return {
      results: data.items.results,
      count: Number(data.items.count ?? data.count ?? data.items.results.length),
      next: data.items.next ?? null,
      previous: data.items.previous ?? null,
      avg_rating: Number(data.avg_rating ?? 0),
      raw: data,
    };
  }
  const results = Array.isArray(data) ? data : data?.results || [];
  return {
    results,
    count: Number(data?.count ?? results.length),
    next: data?.next ?? null,
    previous: data?.previous ?? null,
    avg_rating: Number(data?.avg_rating ?? 0),
    raw: data,
  };
};
