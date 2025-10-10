import { cancelAdminOrder, refundAdminOrder } from "../components/common/api/admin/adminOrders";
import { mapStatusToKorean } from "../components/common/api/admin/adminOrders.adapters";

const pickOrderIdFromItems = (items = []) =>
  items.find((it) => it?._meta?.order_id)?.[ "_meta" ]?.order_id ??
  (items.find((it) => it?._meta?.order_id) ? items.find((it) => it?._meta?.order_id)._meta.order_id : null);

export function useAdminOrderActions({ orders, setOrders, pushToast }) {
  /** 관리자 취소 */
  const adminCancel = async (orderId, { skipConfirm = false } = {}) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    const orderIdForAPI = pickOrderIdFromItems(target.items) || orderId;

    try {
      if (!skipConfirm && !window.confirm("이 주문을 관리자 권한으로 '취소' 처리할까요?")) return;

      const resp = await cancelAdminOrder(orderIdForAPI, target.items || []);
      const next = mapStatusToKorean(resp?.status) || "취소완료";

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: next, request: null } : o))
      );

      pushToast?.("관리자 권한으로 취소 처리했습니다.", { type: "success" });
    } catch (e) {
      console.error("adminCancel failed", e);
      const backendMsg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        (Array.isArray(e?.response?.data?.non_field_errors)
          ? e.response.data.non_field_errors.join(", ")
          : "") ||
        (e?.response?.status === 409 ? "현재 상태에서는 취소할 수 없습니다." : "");
      pushToast?.("취소 처리에 실패했습니다.", {
        type: "error",
        description: backendMsg || "잠시 후 다시 시도해주세요.",
      });
    }
  };

  /** 관리자 환불 */
  const adminRefund = async (orderId, { skipConfirm = false } = {}) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    const orderIdForAPI = pickOrderIdFromItems(target.items) || orderId;

    try {
      if (!skipConfirm && !window.confirm("이 주문을 관리자 권한으로 '환불완료' 처리할까요?")) return;

      const resp = await refundAdminOrder(orderIdForAPI, target.items || []);
      const next = mapStatusToKorean(resp?.status) || "환불완료";

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: next, request: null } : o))
      );

      pushToast?.("관리자 권한으로 환불 처리했습니다.", { type: "success" });
    } catch (e) {
      console.error("adminRefund failed", e);
      const backendMsg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        (Array.isArray(e?.response?.data?.non_field_errors)
          ? e.response.data.non_field_errors.join(", ")
          : "") ||
        (e?.response?.status === 409 ? "현재 상태에서는 환불할 수 없습니다." : "");
      pushToast?.("환불 처리에 실패했습니다.", {
        type: "error",
        description: backendMsg || "잠시 후 다시 시도해주세요.",
      });
    }
  };

  return { adminCancel, adminRefund };
}
