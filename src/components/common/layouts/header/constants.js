// 카테고리 메뉴

export const PRIMARY = [
  { key: "WOMEN", label: "WOMEN", ready: true },
  { key: "MEN", label: "MEN", ready: true },
  { key: "KIDS", label: "KIDS", ready: false }, // 준비중
  { key: "EVENT", label: "EVENT", ready: false }, // 준비중
];
export const SEARCH = "__SEARCH__";

export const SUBS = {
  WOMEN: [
    { title: "원피스", items: ["원피스"] },
    { title: "상의", items: ["아우터", "긴팔", "반팔", "스포츠웨어"] },
    { title: "하의", items: ["반바지", "긴바지", "청바지", "슬랙스", ] },
    { title: "신발", items: ["스니커즈", "구두", "샌들/슬리퍼"] },
  ],
  MEN: [
    { title: "상의", items: ["아우터", "긴팔", "반팔", "스포츠웨어"] },
    { title: "하의", items: ["반바지", "긴바지", "청바지", "슬랙스"] },
    { title: "신발", items: ["스니커즈", "구두", "샌들/슬리퍼"] },
  ],
  KIDS: [
    { title: "후디", items: ["기본", "기모", "지퍼"] },
    { title: "팬츠", items: ["조거", "트레이닝", "데님"] },
    { title: "셔츠", items: ["체크", "솔리드"] },
    { title: "세트", items: ["상하세트", "홈웨어"] },
  ],
};

export const SUGGEST = {
  WOMEN: ["울코트", "플리츠 스커트", "크롭 니트", "부츠컷 데님", "앙고라 가디건", "버뮤다 팬츠"],
  MEN: ["옥스포드 셔츠", "테이퍼드 데님", "니트 폴로", "테크 조거", "트러커 재킷", "울 블렌드 코트"],
  KIDS: ["상하세트", "기모 조거", "덤블 후디", "체크 셔츠", "친환경 코튼", "홈웨어"],
};
