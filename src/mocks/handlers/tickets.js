import { http, HttpResponse, delay } from 'msw';
import mockTickets from '../../components/features/admin/cs/mockTickets';

let TICKETS = [...mockTickets];

export const ticketsHandlers = [
  // 목록(검색/상태/우선순위/기간)
  http.get('/api/tickets', async ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').toLowerCase();
    const status = url.searchParams.get('status') || '';    // 열림/대기/답변완료/종료
    const priority = url.searchParams.get('priority') || ''; // 낮음/보통/높음
    const startDate = url.searchParams.get('start') || '';
    const endDate = url.searchParams.get('end') || '';

    let data = TICKETS.filter(t => {
      const byQ =
        !q ||
        t.code.toLowerCase().includes(q) ||
        (t.subject || '').toLowerCase().includes(q) ||
        (t.customer?.name || '').toLowerCase().includes(q) ||
        (t.customer?.email || '').toLowerCase().includes(q);
      const byStatus = !status || t.status === status;
      const byPriority = !priority || t.priority === priority;

      let byDate = true;
      if (startDate || endDate) {
        const ts = new Date(t.created_at.replace(' ', 'T'));
        if (startDate && ts < new Date(startDate)) byDate = false;
        if (endDate) {
          const e = new Date(endDate);
          e.setHours(23, 59, 59, 999);
          if (ts > e) byDate = false;
        }
      }
      return byQ && byStatus && byPriority && byDate;
    });

    await delay(150);
    return HttpResponse.json({ data, total: data.length });
  }),

  // 상세
  http.get('/api/tickets/:id', ({ params }) => {
    const id = Number(params.id);
    const t = TICKETS.find(x => x.id === id);
    if (!t) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(t);
  }),

  // 상태 변경
  http.patch('/api/tickets/:id/status', async ({ params, request }) => {
    const id = Number(params.id);
    const { status } = await request.json();
    TICKETS = TICKETS.map(t => (t.id === id ? { ...t, status } : t));
    return HttpResponse.json({ ok: true });
  }),

  // 담당자 지정
  http.patch('/api/tickets/:id/assignee', async ({ params, request }) => {
    const id = Number(params.id);
    const { assignee } = await request.json();
    TICKETS = TICKETS.map(t => (t.id === id ? { ...t, assignee } : t));
    return HttpResponse.json({ ok: true });
  }),

  // 태그 추가/삭제
  http.post('/api/tickets/:id/tags', async ({ params, request }) => {
    const id = Number(params.id);
    const { tag } = await request.json();
    TICKETS = TICKETS.map(t => {
      if (t.id !== id) return t;
      const next = Array.from(new Set([...(t.tags || []), tag]));
      return { ...t, tags: next };
    });
    return HttpResponse.json({ ok: true });
  }),
  http.delete('/api/tickets/:id/tags', async ({ params, request }) => {
    const id = Number(params.id);
    const { tag } = await request.json();
    TICKETS = TICKETS.map(t => {
      if (t.id !== id) return t;
      return { ...t, tags: (t.tags || []).filter(x => x !== tag) };
    });
    return HttpResponse.json({ ok: true });
  }),

  // 내부 메모 추가
  http.post('/api/tickets/:id/notes', async ({ params, request }) => {
    const id = Number(params.id);
    const { text, author = '관리자' } = await request.json();
    const note = { id: 'n' + Date.now(), author, at: new Date().toLocaleString(), text };
    TICKETS = TICKETS.map(t => (t.id === id ? { ...t, internal_notes: [...(t.internal_notes || []), note] } : t));
    return HttpResponse.json({ ok: true, note });
  }),

  // 답변(메시지) 추가 (+옵션: 완료처리)
  http.post('/api/tickets/:id/reply', async ({ params, request }) => {
    const id = Number(params.id);
    const { text, markDone } = await request.json();
    const msg = { id: 'm' + Date.now(), role: 'agent', name: '관리자', at: new Date().toLocaleString(), text };
    TICKETS = TICKETS.map(t =>
      t.id === id ? { ...t, messages: [...t.messages, msg], status: markDone ? '답변완료' : t.status } : t
    );
    return HttpResponse.json({ ok: true, message: msg });
  }),
];
