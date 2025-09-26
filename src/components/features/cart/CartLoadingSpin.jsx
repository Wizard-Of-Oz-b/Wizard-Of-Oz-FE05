export default function CartLoadingSpin() {
  return (
    <div
      className=" flex justify-center items-center fixed inset-0 w-full h-full bg-black/50 z-50"
    >
      <div
        className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 
        rounded-full animate-spin"
      ></div>
    </div>
  );
}

