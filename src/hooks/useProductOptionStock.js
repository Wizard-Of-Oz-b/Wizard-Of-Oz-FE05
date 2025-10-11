import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProductStocks } from "../lib/stocks";

// option_key를 언제나 같은 규칙(키 알파벳 정렬)으로 만들어 줌.
function canonicalKey(obj) {
  const entries = Object.entries(obj).filter(([, v]) => v != null && v !== "");
  entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  const sp = new URLSearchParams(Object.fromEntries(entries));
  return sp.toString();
}

// 서버에서 내려온 option_key 문자열을 동일한 규칙으로 정규화
function normalizeServerKey(raw) {
  try {
    const sp = new URLSearchParams(String(raw || ""));
    const obj = {};
    for (const [k, v] of sp.entries()) obj[k] = v;
    return canonicalKey(obj);
  } catch {
    return String(raw || "");
  }
}

/**
 * 상품 옵션(색상/사이즈)의 재고를 조회해
 * - 버튼 활성/비활성 상태
 * - 선택 조합이 품절일 때를 계산해 주는 훅입니다.
 *
 * @param {Object} params
 * @param {Object} params.product - { colors: [], sizes: [], id 또는 product_id 포함 }
 * @param {string} params.color - 현재 선택된 색상 코드
 * @param {Function} params.setColor - 색상 setState
 * @param {string} params.size - 현재 선택된 사이즈
 * @param {Function} params.setSize - 사이즈 setState
 */
export function useProductOptionStock({ product, color, setColor, size, setSize }) {
  const productId = product?.product_id ?? product?.id;

  // 재고 목록 조회
  const { data: stocks = [], isLoading, refetch } = useQuery({
    queryKey: ["product-stocks", productId],
    queryFn: () => fetchProductStocks(productId),
    enabled: !!productId,
    staleTime: 60_000,
  });

  // option_key → 수량 맵으로 변환
  const stockByKey = useMemo(() => {
    const m = Object.create(null);
    for (const row of stocks) {
      const key = normalizeServerKey(row?.option_key);
      const qty = Number(row?.stock_quantity || 0);
      m[key] = (m[key] ?? 0) + qty;
    }
    return m;
  }, [stocks]);

  // 클라이언트에서 항상 정규화된 키로 비교함
  const buildKey = (c, s) => canonicalKey({ color: c, size: s });

  const currentKey = buildKey(color, size);
  const currentQty = stockByKey[currentKey] ?? 0;
  const currentAvailable = currentQty > 0;

  // 각 버튼의 비활성화 여부를 계산
  const isSizeDisabled = (s) => (stockByKey[buildKey(color, s)] ?? 0) <= 0;
  const isColorDisabled = (c) => (stockByKey[buildKey(c?.code, size)] ?? 0) <= 0;

  // 현재 선택 조합이 품절이면, 선택 가능한 첫 조합으로 자동으로 보정해줌.
  useEffect(() => {
    if (!product?.colors?.length || !product?.sizes?.length) return;
    if (currentAvailable) return;

    // 1) 현재 color에서 가능한 size 찾기
    const firstSize = product.sizes.find((s) => (stockByKey[buildKey(color, s)] ?? 0) > 0);
    if (firstSize) {
      setSize(firstSize);
      return;
    }
    // 2) 현재 size에서 가능한 color 찾기
    const firstColor = product.colors.find((c) => (stockByKey[buildKey(c.code, size)] ?? 0) > 0);
    if (firstColor) {
      setColor(firstColor.code);
      return;
    }
    // 3) 전체 조합 중 첫 번째 가능한 조합으로 이동
    for (const c of product.colors) {
      for (const s of product.sizes) {
        if ((stockByKey[buildKey(c.code, s)] ?? 0) > 0) {
          setColor(c.code);
          setSize(s);
          return;
        }
      }
    }
    // 전부 품절이면 그대로 유지
  }, [product, color, size, stockByKey, currentAvailable, setColor, setSize]);

  return {
    isLoading,
    refetch,
    stockByKey,
    currentQty,
    currentAvailable,
    isSizeDisabled,
    isColorDisabled,
  };
}
