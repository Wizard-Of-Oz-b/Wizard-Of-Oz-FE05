import { useNavigate } from "react-router-dom";

const SECTION_STYLE =
  "w-full border border-gray-200 rounded-2xl px-4 py-5 shadow-sm mb-2 bg-gray-400";

export default function EmptyPayment({ script = "주문이 비어있습니다." }) {
  const navigate = useNavigate();

  const onClickHomeBtn = () => {
    navigate("/");
  };
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="w-2/4 flex flex-col justify-center items-center">
        <section className={SECTION_STYLE}>
          <span>{script}</span>
        </section>
      </div>

      <button
        className="border border-gray-300 rounded-sm px-2 py-1"
        onClick={onClickHomeBtn}
      >
        홈페이지로 이동
      </button>
    </div>
  );
}
