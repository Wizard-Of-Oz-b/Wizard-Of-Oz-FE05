export function safeParseJSON(v) {
  if (!v) return null;
  if (typeof v === "object") return v;
  if (typeof v !== "string") return null;

  const s = v.trim();
  if (!s) return null;

  try {
    return JSON.parse(s);
  } catch {}

  if (s.includes("=")) {
    const qs = s.replace(/^\?/, "");
    try {
      const params = new URLSearchParams(qs);
      const obj = {};
      let has = false;
      params.forEach((val, key) => {
        has = true;
        obj[key] = val;
      });
      if (has) return obj;
    } catch {}
  }

  if (s.includes("=")) {
    const obj = {};
    s.split(/[;&]/).forEach((pair) => {
      if (!pair) return;
      const [k, ...rest] = pair.split("=");
      if (!k) return;
      const val = rest.join("=");
      obj[k.trim()] = decodeURIComponent((val ?? "").trim());
    });
    if (Object.keys(obj).length) return obj;
  }

  return null;
}

export function formatOptionsForDisplay(optionsObj) {
  if (!optionsObj || typeof optionsObj !== "object") return "-";
  if (Object.keys(optionsObj).length === 0) return "-";

  const LABEL = { color: "색상", size: "사이즈" };
  const kvs = Object.entries(optionsObj).map(([k, v]) => {
    const keyLabel = LABEL[k] ?? k;
    const valueText =
      v && typeof v === "object"
        ? v.display ?? v.name ?? v.value ?? JSON.stringify(v)
        : String(v ?? "");
    return `${keyLabel}: ${valueText}`;
  });

  return kvs.join(" / ");
}
