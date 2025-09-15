export const STATUS_PRESETS = {
  401: {
    title: "로그인이 필요합니다",
    message: "이 페이지는 회원만 이용할 수 있습니다. \n로그인 후 다시 이용해 주세요.",
    actions: ["login", "home", "back"],
  },
  403: {
    title: "접근 권한이 없습니다",
    message: "요청하신 페이지에 접근할 수 없습니다. \n다른 계정으로 시도하거나 관리자에게 문의해 주세요.",
    actions: ["home", "support"],
  },
  404: {
    title: "페이지를 찾을 수 없습니다",
    message: "주소가 잘못되었거나 페이지가 삭제되었을 수 있습니다. \n아래 검색 기능을 이용해 원하는 상품을 찾아보세요.",
    actions: ["search", "home", "back"],
  },
  429: {
    title: "요청이 너무 많습니다",
    message: "짧은 시간 동안 요청이 과도하게 발생했습니다. \n잠시 후 다시 시도해 주세요.",
    actions: ["home", "back"],
  },
  500: {
    title: "서버 오류가 발생했습니다",
    message: "불편을 드려 죄송합니다. \n잠시 후 다시 이용해 주세요.",
    actions: ["home", "support"],
  },
  502: {
    title: "게이트웨이 오류가 발생했습니다",
    message: "서버 응답이 올바르지 않습니다. \n잠시 후 다시 시도해 주세요.",
    actions: ["home", "back"],
  },
  503: {
    title: "서비스가 일시적으로 중단되었습니다",
    message: "현재 점검 또는 일시적인 장애로 이용이 어렵습니다. \n잠시 후 다시 시도해 주세요.",
    actions: ["home", "status"],
  },
  504: {
    title: "응답 시간이 초과되었습니다",
    message: "서버 응답이 지연되고 있습니다. \n네트워크 상태를 확인하시거나 잠시 후 다시 시도해 주세요.",
    actions: ["home", "back"],
  },
};
