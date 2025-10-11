//마이페이지 대시보드 전용

export function SkeletonBox({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-gray-200/70 ${className}`} />;
}

export function OrderItemSkeleton() {
  return (
    <li className="px-2">
      <div className="flex items-center gap-3 py-3">
        <SkeletonBox className="h-20 w-16 rounded-md" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonBox className="h-3 w-44" />
          <SkeletonBox className="h-4 w-72" />
          <SkeletonBox className="h-3 w-56" />
        </div>
      </div>
    </li>
  );
}

export function OrderListSkeleton({ count = 3 }) {
  return (
    <ul className="divide-y divide-gray-200">
      {Array.from({ length: count }).map((_, i) => (
        <OrderItemSkeleton key={i} />
      ))}
    </ul>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-3 shadow">
      <SkeletonBox className="aspect-[3/4] w-full rounded-xl" />
      <div className="mt-3 space-y-2">
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3 w-1/2" />
        <SkeletonBox className="h-4 w-20" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ n = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: n }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
