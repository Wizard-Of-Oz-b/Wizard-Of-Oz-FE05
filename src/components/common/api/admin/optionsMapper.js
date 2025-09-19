export function buildOptionsFromForm(form) {
  const options = [];

  // 색상 옵션
  const colorValues = (form.colors || [])
    .filter((c) => c && (c.code || c.name || c.hex))
    .map((c) => ({
      value: c.code || c.name || "",  
      display: c.name || c.code || "", 
      hexCode: (c.hex || "#000000").toUpperCase(), 
    }))
    .filter((v) => v.value || v.display);

  if (colorValues.length) {
    options.push({
      id: "OPT_COLOR",
      name: "색상",
      type: "color",
      values: colorValues,
    });
  }

  // 사이즈 옵션 (중복 제거)
  const seen = new Set();
  const sizeValues = (form.sizes || [])
    .map((s) => String(s || "").trim())
    .filter(Boolean)
    .filter((s) => !seen.has(s) && seen.add(s))
    .map((s) => ({ value: s, display: s }));

  if (sizeValues.length) {
    options.push({
      id: "OPT_SIZE",
      name: "사이즈",
      type: "size",
      values: sizeValues,
    });
  }

  return options;
}

export function hydrateFormFromOptions(initial, base) {
  const next = { ...base };
  const opts = Array.isArray(initial?.options) ? initial.options : [];

  // 기본값
  next.colors = Array.isArray(base.colors) ? base.colors : [{ code: "", name: "", hex: "#000000" }];
  next.sizes  = Array.isArray(base.sizes)  ? base.sizes  : [""];

  // 색상 복원
  const colorOpt = opts.find((o) => (o?.id || "").toUpperCase() === "OPT_COLOR" || o?.type === "color");
  if (colorOpt?.values?.length) {
    next.colors = colorOpt.values.map((v) => ({
      code: v?.value || "",
      name: v?.display || v?.value || "",
      hex: (v?.hexCode || "#000000").toUpperCase(),
    }));
  }

  // 사이즈 
  const sizeOpt = opts.find((o) => (o?.id || "").toUpperCase() === "OPT_SIZE" || o?.type === "size");
  if (sizeOpt?.values?.length) {
    next.sizes = sizeOpt.values.map((v) => v?.value || v?.display || "").filter(Boolean);
  }

  return next;
}
