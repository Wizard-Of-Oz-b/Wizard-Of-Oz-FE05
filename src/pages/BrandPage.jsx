import { motion } from "framer-motion";

export default function BrandPage() {
  const fadeUp = {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.55, ease: "easeOut" },
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="relative h-[72vh] min-h-[520px] overflow-hidden">
  {/* 배경 이미지 */}
  <div
    aria-hidden
    className="absolute inset-0 bg-center bg-cover"
    style={{
      backgroundImage: "url('https://vteallasuiryfibljlww.supabase.co/storage/v1/object/public/s/brandhero.jpg')",
      filter: "brightness(0.9)",
    }}
  />
  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

  <div className="relative h-full mx-auto max-w-6xl px-6 sm:px-8 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="w-full sm:max-w-3xl rounded-2xl border border-white/20 bg-black/35 backdrop-blur-md px-6 py-6 sm:px-8 sm:py-8 text-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]"
    >
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-[36px] sm:text-[54px] leading-[1.06] font-extrabold tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] text-center"
      >
        <span className="bg-gradient-to-r from-violet-300 to-pink-400 bg-clip-text text-transparent">
          “당신의 일상을 특별하게”
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut", delay: 0.06 }}
        className="mx-auto mt-4 max-w-2xl text-[15px] sm:text-[16px] text-white/90 text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
      >
        오즈는 한 벌의 옷이 하루의 분위기를 바꾼다고 믿습니다. <br />
        출근길의 설렘부터 거울 앞의 자신감, 그리고 중요한 순간의 품격까지—
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.12 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <a
          href="#"
          className="rounded-full border border-white/60 bg-white/10 backdrop-blur px-5 py-2.5 text-sm font-semibold hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          브랜드 이야기
        </a>
        <a
          href="#"
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-pink-300"
        >
          신상품 보러가기
        </a>
      </motion.div>
    </motion.div>
  </div>
</section>


      <section id="story" className="mx-auto max-w-6xl px-6 sm:px-8 pt-14">
        <motion.h2 {...fadeUp} className="text-xl sm:text-2xl font-extrabold tracking-tight">
          우리는 ‘일상의 순간’을 바꿉니다
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.05 }}
          className="mt-2 max-w-3xl text-sm sm:text-[15px] text-neutral-700"
        >
          첫인상은 실루엣에서 시작됩니다. 오즈는
          <b> 체형·동선·케어까지 고려한 패턴과 소재</b>로
          ‘입는 순간 달라지는 기분’을 설계합니다.
        </motion.p>

        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
          {["https://becky6557.cafe24.com/web/product/small/202310/beb70718567b93928aba14025828aad1.webp", "https://becky6557.cafe24.com/web/product/small/202310/161e43075121fa4076947a29780e4266.webp", "https://becky6557.cafe24.com/web/product/small/202212/9ccd690dcf460c614394cb038909e14b.webp"].map((src, i) => (
            <motion.figure
              key={src}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm transition-transform duration-300 hover:-translate-y-[2px] hover:shadow-md"
            >
              <img src={src} alt={`oz-story-${i + 1}`} className="h-full w-full object-cover" />
              <motion.div
                aria-hidden
                className="absolute inset-0"
                initial={{ x: "-30%", opacity: 0 }}
                whileInView={{ x: "120%", opacity: 0.28 }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, ease: "easeInOut", delay: 0.15 }}
                style={{
                  background:
                    "linear-gradient(100deg, transparent 20%, rgba(255,255,255,.55) 50%, transparent 80%)",
                }}
              />
            </motion.figure>
          ))}
        </div>
      </section>

      <section id="values" className="mx-auto max-w-6xl px-6 sm:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { t: "핏", s: "체형별 보정 패턴" },
            { t: "촉감", s: "피부에 닿는 감각 테스트" },
            { t: "지속성", s: "세탁·내구 안정성" },
            { t: "케어", s: "첫 구매 무료반품" },
          ].map((x, i) => (
            <motion.div
              key={x.t}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <p className="text-[13px] font-extrabold">{x.t}</p>
              <p className="text-[12px] text-neutral-700 mt-1">{x.s}</p>
              <span className="mt-3 inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent text-[11px] font-semibold">
                • OZ Signature
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 sm:px-8 pb-14">
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div {...fadeUp} className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-sm">
            <p className="text-sm font-semibold">PATTERN</p>
            <h3 className="text-lg font-extrabold mt-1">체형 보정 패턴</h3>
            <p className="mt-2 text-sm text-neutral-700">
              힙·허벅지는 슬림하게, 어깨는 안정적으로. 실측 데이터 기반으로 매일 더 예쁜 실루엣을 완성합니다.
            </p>
            <div className="mt-4 aspect-[16/9] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
              <img src="https://becky6557.cafe24.com/web/product/big/202310/f6c7d78574f315a6fd95f9bcadc57b39.webp" alt="oz-pattern" className="h-full w-full object-cover" />
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-sm"
          >
            <p className="text-sm font-semibold">FABRIC</p>
            <h3 className="text-lg font-extrabold mt-1">촉감과 유지력</h3>
            <p className="mt-2 text-sm text-neutral-700">
              원사/혼용률부터 기획합니다. 피부 감촉과 보풀·늘어남 테스트를 통과한 소재만 사용합니다.
            </p>
            <div className="mt-4 aspect-[16/9] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
              <img src="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzExMjlfMTY3%2FMDAxNzAxMjQxNjkyOTU0.ji1PWCwGtOS8d2sw39nG6-ZhEpjg5n5D971PygF-PvEg.8Mg5BjA2AEiWCUiQsNZOUYh6jEEiPR8Mv2MWkiGq6a4g.JPEG.007pang00%2FIMG_8763.JPG&type=sc960_832" alt="oz-fabric" className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </div>

        <motion.div
          {...fadeUp}
          transition={{ delay: 0.08 }}
          className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold">OZ WORLD EXPERIENCE</p>
              <h4 className="text-xl font-extrabold mt-1">피팅룸에서, 거울 앞에서 달라지는 순간</h4>
              <p className="mt-2 text-sm text-neutral-700">
                시그니처 라인을 오프라인에서 먼저 체험하세요. 체형별 핏 컨설팅 · 한정 컬러 · 방문 기프트가 준비되어 있습니다.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <a
                href="/info"
                className="h-11 px-5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-pink-300 flex items-center justify-center"
              >
                매장 안내
              </a>
              <a
                href="/info"
                className="h-11 px-5 rounded-full text-sm font-semibold border border-neutral-300 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-violet-300 flex items-center justify-center"
              >
                피팅 예약
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 sm:px-8 pb-14">
        <div className="flex items-end justify-between">
          <h3 className="text-lg sm:text-xl font-extrabold">당신의 하루를 위한 제안</h3>
          <a href="/results/list?page=1&sort=created_at&primary=MEN" className="text-sm text-neutral-600 hover:text-neutral-900">
            전체 보기 →
          </a>
        </div>
        <ul className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: "p1", name: "카이 데님 롤업 와이드 팬츠", price: 60000, img: "https://image.brandi.me/cproductdetail/2023/08/30/205fd27ed36136381fbfaafb6d051d4b.jpg", href: "/products/d804ec38-f221-4abf-81bb-450982e58152" },
            { id: "p2", name: "후드 집업", price: 50000, img: "https://image.brandi.me/cproductdetail/2023/10/10/9471848a4d502cdf7370b437fefa8904.JPG", href: "/products/2c7c0e61-1d84-4c4d-8bba-bf4dd5579511" },
            { id: "p3", name: "포켓 진청 데님 부츠컷팬츠 청바지", price: 35000, img: "https://image.brandi.me/cproductdetail/2023/08/23/a195ca0354babed252cab5c21fadbd0c.jpg", href: "/products/090302f0-0390-4aad-9201-f24f1389f13a" },
          ].map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="group rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm hover:shadow-md transition"
            >
              <a href={p.href} className="block">
                <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 aspect-[4/5]">
                  <img src={p.img} alt={p.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                </div>
                <p className="mt-3 text-sm font-medium tracking-tight">{p.name}</p>
                <p className="mt-0.5 text-sm font-semibold">{p.price.toLocaleString("ko-KR")}원</p>
              </a>
              <div className="mt-3 flex gap-2">
                <a
                  href={`${p.href}?buy=1`}
                  className="flex-1 inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 text-xs font-semibold text-white hover:opacity-95"
                >
                  바로 구매
                </a>
                <a
                  href={p.href}
                  className="flex-1 inline-flex h-9 items-center justify-center rounded-lg border border-neutral-300 text-xs font-semibold hover:bg-neutral-100"
                >
                  상세 보기
                </a>
              </div>
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-6 sm:px-8 pb-20">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 text-center shadow-sm">
          <h5 className="text-xl font-extrabold">
            이제, <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">당신의 옷장</span>을 바꿔 보세요
          </h5>
          <p className="mt-2 text-sm text-neutral-700">첫 구매 무료반품으로 안심하고 시작하세요. 입는 순간 달라지는 기분을 경험해보세요.</p>
          <div className="mt-5 flex justify-center gap-2">
            
          </div>
        </div>
      </section>

      <div className="fixed bottom-5 right-5 z-50 sm:hidden">
        <a
          href="/info"
          className="h-12 px-5 rounded-full shadow-lg text-sm font-semibold text-white flex items-center justify-center bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-95 active:opacity-90"
        >
          가까운 매장 피팅 예약
        </a>
      </div>
    </div>
  );
}
