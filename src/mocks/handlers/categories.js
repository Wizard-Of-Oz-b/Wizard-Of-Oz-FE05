import { http, HttpResponse } from 'msw';
import mockCategories from '../../components/features/admin/categories/mockCategories';

let CATEGORIES = [...mockCategories];

// 자식 여부 확인
function hasChildren(id) {
  return CATEGORIES.some(c => c.parentId === id);
}

export const categoriesHandlers = [
  // 목록 (평평/트리 둘 다 지원)
  http.get('/api/categories', ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').toLowerCase();
    const flat = url.searchParams.get('flat') === 'true';

    let data = CATEGORIES.filter(c => {
      const byQ = !q || c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
      return byQ;
    });

    // 프론트에서 트리 가공하는 경우가 많아, 여기선 그냥 flat 응답
    // 필요하면 parentId 순/ sort 순으로 정렬해서 내려줌
    data = data.sort((a, b) => {
      if ((a.parentId ?? 0) === (b.parentId ?? 0)) {
        if (a.sort === b.sort) return a.name.localeCompare(b.name);
        return a.sort - b.sort;
      }
      return (a.parentId ?? 0) - (b.parentId ?? 0);
    });

    return HttpResponse.json({ data, total: data.length, flat: true });
  }),

  // 생성
  http.post('/api/categories', async ({ request }) => {
    const body = await request.json();
    const next = { id: Date.now(), product_count: 0, visible: true, sort: 1, ...body };
    CATEGORIES.push(next);
    return HttpResponse.json(next, { status: 201 });
  }),

  // 수정
  http.patch('/api/categories/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const patch = await request.json();
    CATEGORIES = CATEGORIES.map(c => (c.id === id ? { ...c, ...patch } : c));
    return HttpResponse.json({ ok: true });
  }),

  // 삭제 (자식 있으면 409)
  http.delete('/api/categories/:id', ({ params }) => {
    const id = Number(params.id);
    if (hasChildren(id)) {
      return HttpResponse.json({ ok: false, message: 'has children' }, { status: 409 });
    }
    CATEGORIES = CATEGORIES.filter(c => c.id !== id);
    return HttpResponse.json({ ok: true });
  }),

  // 노출 토글
  http.patch('/api/categories/:id/visible', async ({ params, request }) => {
    const id = Number(params.id);
    const { visible } = await request.json();
    CATEGORIES = CATEGORIES.map(c => (c.id === id ? { ...c, visible: !!visible } : c));
    return HttpResponse.json({ ok: true });
  }),

  // 정렬 스왑(같은 parent 내 sort 교환)
  http.post('/api/categories/:id/move', async ({ params, request }) => {
    const id = Number(params.id);
    const { direction } = await request.json(); // 'up' | 'down'
    const target = CATEGORIES.find(c => c.id === id);
    if (!target) return HttpResponse.json({ message: 'Not found' }, { status: 404 });

    const siblings = CATEGORIES
      .filter(c => c.parentId === target.parentId)
      .sort((a, b) => (a.sort - b.sort) || a.name.localeCompare(b.name));
    const idx = siblings.findIndex(s => s.id === id);
    const swapWith = direction === 'up' ? siblings[idx - 1] : siblings[idx + 1];
    if (!swapWith) return HttpResponse.json({ ok: true }); // 끝이면 noop

    const a = CATEGORIES.find(c => c.id === target.id);
    const b = CATEGORIES.find(c => c.id === swapWith.id);
    const tmp = a.sort;
    a.sort = b.sort;
    b.sort = tmp;

    return HttpResponse.json({ ok: true });
  }),
];
