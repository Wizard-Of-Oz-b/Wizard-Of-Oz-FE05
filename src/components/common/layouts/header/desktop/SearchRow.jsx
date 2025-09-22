import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { SEARCH } from "./constants";

const fadeUp = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

export default function SearchRow({ active, keyword, setKeyword, inputRef, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-[120rem] px-6 pt-5 flex items-center gap-3">
      <motion.div className="relative flex-1" variants={fadeUp} initial="hidden" animate="show">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={active === SEARCH ? "어떤 상품을 찾으시나요?" : "키워드로 검색"}
          className="w-full rounded-full border border-gray-300 pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-black/20 bg-white"
        />
      </motion.div>
      <motion.button
        type="submit"
        className="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold hover:bg-black/90"
        variants={fadeUp}
        initial="hidden"
        animate="show"
      >
        검색
      </motion.button>
    </form>
  );
}
