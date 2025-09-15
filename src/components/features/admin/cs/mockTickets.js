export const mockAgents = ["미지정", "윤경복", "김오즈"];

export const mockTickets = [
  {
    id: 1001,
    code: "CS-202509-0001",
    customer: { name: "홍길동", email: "hong@example.com", phone: "010-1234-5678" },
    subject: "사이즈 교환 가능한가요?",
    category: "상품/교환",
    status: "열림", 
    priority: "보통", 
    tags: ["교환", "셔츠"],
    assignee: "김오즈",
    created_at: "2025-09-01 10:13",
    messages: [
      { id: "m1", role: "customer", name: "홍길동", at: "2025-09-01 10:13", text: "구매한 셔츠 L → M 교환 가능할까요?" },
    ],
    internal_notes: [],
  },
  {
    id: 1002,
    code: "CS-202508-0021",
    customer: { name: "김철수", email: "kimc@example.com", phone: "010-2222-3333" },
    subject: "환불 진행 문의",
    category: "주문/환불",
    status: "대기",
    priority: "높음",
    tags: ["환불", "지연"],
    assignee: "미지정",
    created_at: "2025-08-28 16:40",
    messages: [
      { id: "m1", role: "customer", name: "김철수", at: "2025-08-28 16:40", text: "환불 신청했는데 언제 처리되나요?" },
      { id: "m2", role: "agent", name: "김오즈", at: "2025-08-29 09:05", text: "담당부서 확인 중입니다. 오늘 중 업데이트 드릴게요!" },
    ],
    internal_notes: [{ id: "n1", author: "김오즈", at: "2025-08-29 09:10", text: "물류에 회수 입고 지연" }],
  },
];
