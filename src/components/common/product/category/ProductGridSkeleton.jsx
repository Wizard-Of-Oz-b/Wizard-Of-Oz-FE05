import React from "react";

export default function ProductGridSkeleton({ count = 12 }) {
  return (
    <div className="-mx-2 flex flex-wrap pt-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="basis-1/2 px-2 pb-8 md:basis-1/3 lg:basis-1/4">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100" />
          </div>
          <div className="mt-3 h-3 w-24 animate-pulse rounded bg-gray-100" />
          <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-gray-100" />
          <div className="mt-2 h-5 w-1/2 animate-pulse rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}