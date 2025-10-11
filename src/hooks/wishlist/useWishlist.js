import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addWishlist, listWishlist, moveWishlistToCart, removeWishlist } from "../../components/common/api/public/wishlist";

const WISHLIST_QK = ["wishlist"];
const CART_QK = ["userCart"];

export function useWishlist(params) {
  return useQuery({
    queryKey: [...WISHLIST_QK, params],
    queryFn: () => listWishlist(params),
    staleTime: 0,
  });
}

export function useAddWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addWishlist,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WISHLIST_QK });
    },
  });
}

export function useRemoveWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeWishlist,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WISHLIST_QK });
    },
  });
}

export function useMoveWishlistToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ wishlist_id, payload }) => moveWishlistToCart(wishlist_id, payload),
    onSuccess: (_data, _vars) => {
      qc.invalidateQueries({ queryKey: CART_QK });
      qc.invalidateQueries({ queryKey: WISHLIST_QK });
    },
  });
}