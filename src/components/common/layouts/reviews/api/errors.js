const translateEnToKo = (msg) => {
  if (!msg || typeof msg !== "string") return null;
  const s = msg.toLowerCase();
  const map = [
    { k: "you must have a paid purchase", v: "해당 상품을 결제한 사용자만 리뷰를 작성할 수 있어요." },
    { k: "review already exists",         v: "이 상품에 대한 리뷰를 이미 작성하셨어요." },
    { k: "a valid integer is required",   v: "정수를 입력해주세요." },
    { k: "this field may not be blank",   v: "값을 입력해주세요." },
    { k: "this field is required",        v: "필수 값입니다." },
    { k: "not authenticated",             v: "로그인이 필요합니다." },
    { k: "permission denied",             v: "권한이 없습니다." },
    { k: "object with",                   v: "요청한 대상을 찾을 수 없습니다." },
    { k: "ensure this value is greater than or equal to 1", v: "값은 1 이상이어야 합니다." },
    { k: "ensure this value is less than or equal to 5",    v: "값은 5 이하여야 합니다." },
    { k: "invalid pk",                    v: "잘못된 요청입니다." },
    { k: "invalid uuid",                  v: "유효한 UUID가 아닙니다." },
    { k: "could not parse",               v: "형식이 올바르지 않습니다." },
  ];
  for (const { k, v } of map) if (s.includes(k)) return v;
  return null;
};

const extractFirstFieldErrorFromErrorsObj = (errors) => {
  if (!errors || typeof errors !== "object") return null;
  for (const k of Object.keys(errors)) {
    const arr = errors[k];
    if (Array.isArray(arr) && arr.length) {
      const raw = arr[0]?.message || arr[0];
      if (typeof raw === "string" && raw.trim()) {
        return translateEnToKo(raw) || raw;
      }
    }
  }
  return null;
};

const extractFirstFieldErrorFromTopLevel = (data) => {
  if (!data || typeof data !== "object") return null;
  for (const [k, v] of Object.entries(data)) {
    if (["detail", "code", "message", "errors"].includes(k)) continue;
    if (Array.isArray(v) && v.length) {
      const raw = typeof v[0] === "string" ? v[0] : v[0]?.message || v[0];
      if (typeof raw === "string" && raw.trim()) {
        return translateEnToKo(raw) || raw;
      }
    }
  }
  return null;
};

export const toKoreanMessage = (e, overrides) => {
  if (overrides?.message) return overrides.message;

  const status = e?.response?.status;
  const data = e?.response?.data;

  const fieldMsg =
    extractFirstFieldErrorFromErrorsObj(data?.errors) ||
    extractFirstFieldErrorFromTopLevel(data);
  if (fieldMsg) return fieldMsg;

  const detailRaw = data?.detail || data?.message || null;
  if (typeof detailRaw === "string" && detailRaw.trim()) {
    if (/[가-힣]/.test(detailRaw)) return detailRaw;
    const translated = translateEnToKo(detailRaw);
    if (translated) return translated;
  }

  const code = data?.code || data?.error || null;
  const byCode =
    (code === "VALIDATION_ERROR" && "요청 값이 올바르지 않습니다.") ||
    (code === "CONFLICT"         && "요청이 현재 상태와 충돌합니다.") ||
    (code === "UNAUTHORIZED"     && "로그인이 필요합니다.") ||
    (code === "FORBIDDEN"        && "권한이 없습니다.") ||
    (code === "NOT_FOUND"        && "요청하신 대상을 찾을 수 없습니다.") ||
    null;
  if (byCode) return byCode;

  const byStatus =
    (status === 400 && "요청 값이 올바르지 않습니다.") ||
    (status === 401 && "로그인이 필요합니다.") ||
    (status === 403 && "권한이 없습니다.") ||
    (status === 404 && "요청하신 대상을 찾을 수 없습니다.") ||
    (status === 409 && "요청이 현재 상태와 충돌합니다.") ||
    (status === 422 && "요청을 처리할 수 없습니다.") ||
    (status >= 500 && "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.") ||
    null;
  if (byStatus) return byStatus;

  return "처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
};

export const rethrowWithKorean = (e, overrides) => {
  const msg = toKoreanMessage(e, overrides);
  const err = new Error(msg);
  if (e?.response) err.response = e.response;
  throw err;
};
