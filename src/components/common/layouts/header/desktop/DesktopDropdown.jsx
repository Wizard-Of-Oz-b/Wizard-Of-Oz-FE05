import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { dropPanel } from "../animations";
import { PRIMARY, SEARCH, SUGGEST } from "../constants";
import SearchRow from "./SearchRow";
import SuggestionsRow from "./SuggestionsRow";
import CategoryGrid from "./CategoryGrid";
import FooterLinks from "./FooterLinks";

export default function DesktopDropdown({
  active,
  keyword,
  setKeyword,
  inputRef,
  onSubmitSearch,
  onSelectSub,
  open,
  delayedClose,
}) {
  const getSuggestions = () => {
    if (!active || active === SEARCH) return SUGGEST.ALL;
    return SUGGEST[active] ?? SUGGEST.ALL;
  };

  const primaryMeta = PRIMARY.find((p) => p.key === active);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="desktop-dropdown"
          className="hidden md:block absolute inset-x-0 top-[100%]"
          onMouseEnter={() => open(active)}
          onMouseLeave={delayedClose}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={dropPanel}
        >
          <div className="w-full bg-white/95 text-black shadow-2xl backdrop-blur">
            <SearchRow active={active} keyword={keyword} setKeyword={setKeyword} inputRef={inputRef} onSubmit={onSubmitSearch} />
            <SuggestionsRow tags={getSuggestions() || []} onClick={(tag) => onSelectSub(active === SEARCH ? null : active, tag)} />
            <div className="h-px bg-gray-200 mx-auto max-w-[120rem] my-3" />

            {primaryMeta && primaryMeta.ready === false? (
              <div className="py-8 text-center text-gray-700 text-lg">
                <div className="font-semibold mb-2">{primaryMeta.label}</div>
                <div>현재 카테고리는 준비중입니다. 곧 찾아뵐게요.</div>
              </div>
            ) : active === SEARCH ? (
              <>
                <div className="mx-auto max-w-[120rem] px-6 pb-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {["신상 모아보기", "아우터 전체", "니트 전체", "데님 전체"].map((txt) => (
                    <button
                      key={txt}
                      className="rounded-lg border border-gray-200 px-4 py-3 text-left hover:bg-gray-50"
                      onClick={() => onSelectSub(null, txt)}
                    >
                      <div className="text-sm font-semibold">{txt}</div>
                      <div className="text-xs text-gray-500 mt-0.5">지금 인기 카테고리</div>
                    </button>
                  ))}
                </div>
                <FooterLinks items={["베스트", "룩북", "매장안내", "기획전"]} />
              </>
            ) : (
              <>
                <CategoryGrid active={active} onSelectSub={onSelectSub} />
                <FooterLinks items={["신상품", "베스트", "매장안내", "기획전"]} />
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
