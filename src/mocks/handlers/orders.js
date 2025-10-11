import { http, HttpResponse, delay } from 'msw';
import mockOrders from '../../components/features/admin/orders/mockOrders';

let ORDERS = [...mockOrders];

export const ordersHandlers = [
  // 주문 목록
  http.get('/api/orders', async ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').toLowerCase();
    const status = url.searchParams.get('status') || '';
    let data = ORDERS.filter(o =>
      (!q || o.orderNo.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)) &&
      (!status || o.status === status)
    );
    await delay(200); // 로딩 느낌
    return HttpResponse.json({ data, total: data.length });
  }),

  // 주문 상세
  http.get('/api/orders/:id', async ({ params }) => {
    const id = Number(params.id);
    const order = ORDERS.find(o => o.id === id);
    if (!order) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(order);
  }),

  // 상태 변경
  http.patch('/api/orders/:id/status', async ({ params, request }) => {
    const id = Number(params.id);
    const body = await request.json(); // { status: "배송중" }
    ORDERS = ORDERS.map(o => (o.id === id ? { ...o, status: body.status } : o));
    return HttpResponse.json({ ok: true });
  }),

  // 운송장 저장 (+ 자동 상태 전환)
  http.patch('/api/orders/:id/tracking', async ({ params, request }) => {
    const id = Number(params.id);
    const body = await request.json(); // { carrier, trackingNo }
    ORDERS = ORDERS.map(o => {
      if (o.id !== id) return o;
      const nextStatus =
        body.carrier && body.trackingNo
          ? (o.status === '결제완료' ? '상품준비' : o.status)
          : o.status;
      return { ...o, carrier: body.carrier, trackingNo: body.trackingNo, status: nextStatus };
    });
    return HttpResponse.json({ ok: true });
  }),
];
