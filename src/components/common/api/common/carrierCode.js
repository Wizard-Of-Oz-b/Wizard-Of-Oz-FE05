export function toCarrierCode(input) {
  if (!input) return "";
  const k = String(input).trim().toLowerCase();

  const map = {
    "cj": "kr.cjlogistics",
    "cj대한통운": "kr.cjlogistics",
    "대한통운": "kr.cjlogistics",
    "롯데": "kr.lotte",
    "롯데택배": "kr.lotte",
    "lotte": "kr.lotte",
    "한진": "kr.hanjin",
    "한진택배": "kr.hanjin",
    "우체국": "kr.koreapost",
    "우체국택배": "kr.koreapost",
    "koreapost": "kr.koreapost",
    "로젠": "kr.logen",
    "로젠택배": "kr.logen",
    "logen": "kr.logen",
  };

  if (k.startsWith("kr.")) return k;

  return map[k] || "";
}

export const CARRIER_LABEL = {
  "kr.cjlogistics": "CJ대한통운",
  "kr.lotte": "롯데택배",
  "kr.hanjin": "한진택배",
  "kr.koreapost": "우체국택배",
  "kr.logen": "로젠택배",
};
