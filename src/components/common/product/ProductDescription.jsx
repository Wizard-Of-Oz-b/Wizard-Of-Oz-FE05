export default function ProductDescription({ description }) {
  return (
    <section className="my-12 bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-lg p-10 border border-gray-100 relative overflow-hidden">
      {/* 배경 포인트 장식 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      </div>

      <div className="relative">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b-2 border-slate-700 inline-block">
          제품 상세 설명
        </h2>

        {/* 설명 텍스트 */}
        <p className="text-gray-700 leading-relaxed text-lg mb-6">
          {description || "이 상품에 대한 설명이 준비되어 있습니다."}
        </p>

        {/* 혜택/포인트 강조 */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
          <p className="text-xl font-semibold text-slate-800 mb-2">
            ✨ 고급스러움과 품격을 담은 아이템 ✨
          </p>
          <p className="text-gray-600">
            세련된 디자인과 완벽한 착용감.
            <span className="text-slate-700 font-bold"> 클래식 무드</span>로 오래도록 함께할 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
