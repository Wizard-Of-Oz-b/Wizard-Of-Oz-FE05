export default function WishlistCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
      <div className="relative overflow-hidden rounded-xl bg-neutral-200 aspect-[4/5]" />
      <div className="mt-3 h-4 bg-neutral-200 rounded w-3/4" />
      <div className="mt-2 h-3 bg-neutral-200 rounded w-1/2" />
      <div className="mt-3 flex gap-2">
        <div className="flex-1 h-8 bg-neutral-200 rounded" />
        <div className="flex-1 h-8 bg-neutral-200 rounded" />
      </div>
    </div>
  );
}
