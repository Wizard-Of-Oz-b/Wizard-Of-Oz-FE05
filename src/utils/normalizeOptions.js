export function normalizeOptions(input) {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input.map((opt) => ({
      id: String(opt?.id ?? ""),
      values: Array.isArray(opt?.values) ? opt.values : [],
    }));
  }

  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      return normalizeOptions(parsed);
    } catch {
      return [];
    }
  }

  if (typeof input === "object") {
    const map = input;

    const keyAlias = (k) => {
      const up = String(k || "").toUpperCase();
      if (up.includes("COLOR")) return "OPT_COLOR";
      if (up.includes("SIZE")) return "OPT_SIZE";
      return up; 
    };

    return Object.entries(map).map(([k, values]) => ({
      id: keyAlias(k),
      values: Array.isArray(values) ? values : (values != null ? [values] : []),
    }));
  }

  return [];
}

export function pickColorHex(v) {
  return v?.hexCode || v?.hex || v?.value || v;
}

export function pickDisplay(v) {
  return v?.display || v?.label || v?.value || v;
}