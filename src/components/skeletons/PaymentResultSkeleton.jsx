export default function PaymentResultSkeleton() {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-2 animate-pulse">
      <div className="w-2/4 h-8 bg-gray-100"></div>
      <div className="w-3/4 h-5 bg-gray-100"></div>
      <div className="w-3/4 h-5 bg-gray-100"></div>
      <div className="flex justify-around w-3/4 h-6">
        <div className="w-1/4 h-5 bg-gray-100"></div>
        <div className="w-1/4 h-5 bg-gray-100"></div>
      </div>
    </div>
  );
}
