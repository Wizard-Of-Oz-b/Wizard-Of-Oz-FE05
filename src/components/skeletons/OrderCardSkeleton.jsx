export default function OrderCardSkeleton() {
  return (
    <div className="w-full border border-neutral-200 shadow-sm rounded-lg p-6 animate-pulse">
      <div className="space-y-5">
        
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-300 rounded w-1/3"></div>
          <div className="h-5 bg-gray-300 rounded w-1/5"></div>
        </div>

        <div className="pt-5 border-t border-gray-200 space-y-4">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>

        <div className="pt-5 border-t border-gray-200 flex justify-end">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}
