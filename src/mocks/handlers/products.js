import { http, HttpResponse, delay } from 'msw';
import mockProducts from '../../components/features/admin/products/mockProducts';

let PRODUCTS = [...mockProducts];

function filterProducts(url) {
  const q = (url.searchParams.get('q') || '').toLowerCase();
  const cat = url.searchParams.get('category') || '';
  const visible = url.searchParams.get('visible'); // 'true' | 'false' | null
  return PRODUCTS.filter(p => {
    const byQ = !q || p.name.toLowerCase().includes(q) || String(p.sku || '').toLowerCase().includes(q);
    const byCat = !cat || p.categoryId === Number(cat) || (p.category_ids || []).includes(Number(cat));
    const byVisible = visible == null ? true : String(p.visible) === visible;
    return byQ && byCat && byVisible;
  });
}

export const productsHandlers = [
  // 목록
  http.get('/api/products', async ({ request }) => {
    const url = new URL(request.url);
    let data = filterProducts(url);
    await delay(150);
    return HttpResponse.json({ data, total: data.length });
  }),

  // 상세
  http.get('/api/products/:id', ({ params }) => {
    const id = Number(params.id);
    const item = PRODUCTS.find(p => p.id === id);
    if (!item) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(item);
  }),

  // 생성
  http.post('/api/products', async ({ request }) => {
    const body = await request.json();
    const next = { id: Date.now(), ...body };
    PRODUCTS.unshift(next);
    return HttpResponse.json(next, { status: 201 });
  }),

  // 수정
  http.patch('/api/products/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const patch = await request.json();
    PRODUCTS = PRODUCTS.map(p => (p.id === id ? { ...p, ...patch } : p));
    return HttpResponse.json({ ok: true });
  }),

  // 삭제
  http.delete('/api/products/:id', ({ params }) => {
    const id = Number(params.id);
    PRODUCTS = PRODUCTS.filter(p => p.id !== id);
    return HttpResponse.json({ ok: true });
  }),

  // 노출 토글
  http.patch('/api/products/:id/visible', async ({ params, request }) => {
    const id = Number(params.id);
    const { visible } = await request.json();
    PRODUCTS = PRODUCTS.map(p => (p.id === id ? { ...p, visible: !!visible } : p));
    return HttpResponse.json({ ok: true });
  }),
];
