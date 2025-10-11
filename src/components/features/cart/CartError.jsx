import { MdError } from "react-icons/md";

export default function CartError({ onRetry, error }) {
  console.error(error);
  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col border w-[300px] lg:w-[800px] justify-center items-center px-4">
        <MdError size={60} color="black" />

        <h2 className="text-3xl">오류 발생</h2>
        {error}
        <p>
          장바구니 데이터를 불러오는데 실패 했습니다. 새로고침이나 아래의 다시
          시도 버튼을 눌러서 다시 시도 해주세요. 문제가 반복되면 고객센터로 문의
          주세요.
        </p>
        <button
          onClick={onRetry}
          className="border border-gray-300 px-3 py-0.5 mb-1 mt-20"
        >
          다시시도
        </button>
      </div>
    </div>
  );
}
