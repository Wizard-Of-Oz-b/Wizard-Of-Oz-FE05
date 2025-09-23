import { http, HttpResponse } from 'msw';
import mockCoupons from '../../components/features/admin/coupons/mockCoupons';

let COUPONS = [...mockCoupons];

export const couponsHandlers = [
  http.get('/api/coupons', ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').toLowerCase();
    const status = url.searchParams.get('status') || '';
    const now = new Date();
    const getStatus = (c) => {
      if (!c.active) return '비활성';
      const s = c.startDate ? new Date(c.startDate) : null;
      const e = c.endDate ? new Date(c.endDate) : null;
      if (s && now < s) return '예정';
      if (e && now > e) return '만료';
      return '진행중';
    };
    let data = COUPONS.filter(c =>
      (!q || c.code.toLowerCase().includes(q) || (c.name || '').toLowerCase().includes(q)) &&
      (!status || getStatus(c) === status)
    );
    return HttpResponse.json({ data, total: data.length });
  }),

  http.post('/api/coupons', async ({ request }) => {
    const body = await request.json();
    COUPONS.unshift(body);
    return HttpResponse.json(body, { status: 201 });
  }),

  http.patch('/api/coupons/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const body = await request.json();
    COUPONS = COUPONS.map(c => (c.id === id ? { ...c, ...body } : c));
    return HttpResponse.json({ ok: true });
  }),

  http.delete('/api/coupons/:id', ({ params }) => {
    const id = Number(params.id);
    COUPONS = COUPONS.filter(c => c.id !== id);
    return HttpResponse.json({ ok: true });
  }),
];
