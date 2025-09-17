import React, { forwardRef } from "react";
import { ShoppingCart } from "lucide-react";

const CartDock = forwardRef(function CartDock({ count = 0 }, ref) {
  return (
    <div ref={ref} className="relative inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-2">
      <ShoppingCart className="h-5 w-5" />
      <span className="text-sm">카트</span>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-black text-[11px] text-white">
          {count}
        </span>
      )}
    </div>
  );
});

export default CartDock;
