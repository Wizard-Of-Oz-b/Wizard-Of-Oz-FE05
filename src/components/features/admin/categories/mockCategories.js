const mockCategories = [
  { id: 1, name: "상의", slug: "tops", parentId: null, visible: true, sort: 1, product_count: 124 },
  { id: 2, name: "하의", slug: "bottoms", parentId: null, visible: true, sort: 2, product_count: 98 },
  { id: 3, name: "아우터", slug: "outer", parentId: null, visible: true, sort: 3, product_count: 52 },

  { id: 11, name: "셔츠", slug: "shirts", parentId: 1, visible: true, sort: 1, product_count: 48 },
  { id: 12, name: "티셔츠", slug: "tshirts", parentId: 1, visible: true, sort: 2, product_count: 37 },
  { id: 13, name: "니트/스웨터", slug: "knit", parentId: 1, visible: true, sort: 3, product_count: 39 },

  { id: 21, name: "청바지", slug: "jeans", parentId: 2, visible: true, sort: 1, product_count: 33 },
  { id: 22, name: "슬랙스", slug: "slacks", parentId: 2, visible: true, sort: 2, product_count: 40 },

  { id: 31, name: "재킷", slug: "jacket", parentId: 3, visible: true, sort: 1, product_count: 25 },
  { id: 32, name: "코트", slug: "coat", parentId: 3, visible: false, sort: 2, product_count: 27 },
];

export default mockCategories;
