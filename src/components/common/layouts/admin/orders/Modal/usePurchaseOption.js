import { useEffect, useMemo, useState } from "react";
import api from "../../../../../../lib/axios";

function pickHeaderOptionRaw(order) {
  let cand =
    order?.options ??
    order?.option_key ??
    order?.optionKey ??
    order?._meta?.options ??
    order?._meta?.option_key ??
    order?.meta?.options ??
    order?.meta?.option_key ??
    order?.header?.options ??
    order?.header?.option_key ??
    order?.purchase?.options ??
    order?.purchase?.option_key ??
    order?.items?.[0]?._meta?.option_key ??
    order?.items?.[0]?.option_key ??
    null;

  if (cand && typeof cand === "object" && Object.keys(cand).length === 0) cand = null;
  if (cand === "" || cand === "-") cand = null;
  return cand ?? "-";
}

export function usePurchaseOption(order) {
  const [purchaseOptionRaw, setPurchaseOptionRaw] = useState("-");
  const [fetched, setFetched] = useState(false);

  const headerRaw = useMemo(() => pickHeaderOptionRaw(order), [order]);

  useEffect(() => {
    if (!order) return;

    if (
      headerRaw &&
      headerRaw !== "-" &&
      !(typeof headerRaw === "object" && Object.keys(headerRaw).length === 0)
    ) {
      setPurchaseOptionRaw(headerRaw);
      return;
    }

    const purchaseId = order?.purchase_id ?? order?.id ?? order?.purchaseId;
    if (!purchaseId || fetched) return;

    (async () => {
      try {
        setFetched(true);
        const res = await api.get(`/v1/orders/purchases/${purchaseId}/`);
        const data = res.data || {};
        const cand =
          (data.options && Object.keys(data.options || {}).length > 0
            ? data.options
            : data.option_key) ?? "-";
        setPurchaseOptionRaw(cand || "-");
      } catch {
        setPurchaseOptionRaw("-");
      }
    })();
  }, [order, headerRaw, fetched]);

  const fallbackRaw = useMemo(
    () => (headerRaw !== "-" ? headerRaw : purchaseOptionRaw) ?? "-",
    [headerRaw, purchaseOptionRaw]
  );

  return { headerRaw, purchaseOptionRaw, fallbackRaw };
}
