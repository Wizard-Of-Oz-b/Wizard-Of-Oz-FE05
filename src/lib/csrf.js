export function getCookie(name) {
  try {
    const m = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[2]) : null;
  } catch {
    return null;
  }
}

export const isUnsafe = (m = "get") =>
  /post|put|patch|delete/i.test(String(m || "get"));
