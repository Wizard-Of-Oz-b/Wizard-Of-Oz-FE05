const SECTION_STYLE =
  "w-full border border-gray-200 rounded-2xl px-4 py-5 shadow-sm mb-2 bg-gray-300";
const SECTION_TITLE_STYLE = "text-xl font-bold";

export default function PaymentSkeleton() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-2/4 flex flex-col justify-center items-center">
        <section className={`${SECTION_STYLE} animate-pulse`}>
          <h2 className={SECTION_TITLE_STYLE}>
            <div className="h-7 w-32 bg-gray-200 rounded-md"></div>
          </h2>
          <div className="mt-2">
            <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
          </div>
        </section>
        <section className={`${SECTION_STYLE} animate-pulse`}>
          <h2 className={SECTION_TITLE_STYLE}>
            <div className="h-7 w-32 bg-gray-200 rounded-md"></div>
          </h2>
          <div className="mt-2">
            <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
          </div>
        </section>
        <section className={`${SECTION_STYLE} animate-pulse`}>
          <h2 className={SECTION_TITLE_STYLE}>
            <div className="h-7 w-32 bg-gray-200 rounded-md"></div>
          </h2>
          <div className="mt-2">
            <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
          </div>
        </section>
      </div>
    </div>
  );
}
