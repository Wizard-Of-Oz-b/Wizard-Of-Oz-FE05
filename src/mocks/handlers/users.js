import { http, HttpResponse, delay } from 'msw';
import mockMembers from '../../components/features/admin/member/mockMembers';

let USERS = [...mockUsers];

export const usersHandlers = [
  http.get('/api/users', async ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').toLowerCase();
    const role = url.searchParams.get('role') || ''; // '슈퍼admin' | '페이지관리자' | 'cs관리자' | '일반고객'
    const active = url.searchParams.get('active'); // 'true' | 'false' | null

    let data = USERS.filter(u => {
      const byQ =
        !q ||
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.username || '').toLowerCase().includes(q) ||
        (u.phone || '').includes(q);
      const byRole = !role || (u.role === role);
      const byActive = active == null ? true : String(u.active) === active;
      return byQ && byRole && byActive;
    });
    await delay(120);
    return HttpResponse.json({ data, total: data.length });
  }),

  // 상세
  http.get('/api/users/:id', ({ params }) => {
    const id = Number(params.id);
    const user = USERS.find(u => u.id === id);
    if (!user) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(user);
  }),

  // 생성
  http.post('/api/users', async ({ request }) => {
    const body = await request.json();
    const next = { id: Date.now(), active: true, role: '일반고객', ...body };
    USERS.unshift(next);
    return HttpResponse.json(next, { status: 201 });
  }),

  // 수정
  http.patch('/api/users/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const patch = await request.json();
    USERS = USERS.map(u => (u.id === id ? { ...u, ...patch } : u));
    return HttpResponse.json({ ok: true });
  }),

  // 등급(권한) 변경
  http.patch('/api/users/:id/role', async ({ params, request }) => {
    const id = Number(params.id);
    const { role } = await request.json();
    USERS = USERS.map(u => (u.id === id ? { ...u, role } : u));
    return HttpResponse.json({ ok: true });
  }),

  // 활성 토글
  http.patch('/api/users/:id/active', async ({ params, request }) => {
    const id = Number(params.id);
    const { active } = await request.json();
    USERS = USERS.map(u => (u.id === id ? { ...u, active: !!active } : u));
    return HttpResponse.json({ ok: true });
  }),
];
