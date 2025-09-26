export default function CartSkeleton() {
  return (
    <div
      className="w-full py-4 border-b border-gray-200
         grid grid-cols-[auto_1fr_100px_120px_120px_100px] gap-x-4 items-center animate-pulse"
    >
      <div className="bg-gray-200 rounded-sm w-[1.5em] h-[1.5em]"></div>

      <div className="flex items-center">
        {/* 이미지 스켈레톤 */}
        <div className="bg-gray-200 rounded-md w-[140px] h-[190px]"></div>
        <div className="flex flex-col w-[400px] ml-4 space-y-3">
          <div className="bg-gray-200 rounded-md h-6 w-3/4"></div>

          <div className="bg-gray-200 rounded-md h-4 w-1/2"></div>
        </div>
      </div>

      <div className="bg-gray-200 rounded-md w-20 h-8 mx-auto"></div>

      <div className="bg-gray-200 rounded-md w-16 h-6 mx-auto"></div>

      <div className="bg-gray-200 rounded-md w-20 h-6 mx-auto"></div>

      <div className="flex flex-col items-center space-y-2">
        <div className="bg-gray-200 rounded-md w-20 h-8"></div>
        <div className="bg-gray-200 rounded-md w-20 h-8"></div>
      </div>
    </div>
  );
}
