import { useNavigate, useSearchParams } from "react-router-dom";

export default function PayFail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");

  const onClickHomeBtn = () => {
    navigate("/");
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-around border border-gray-300 w-200 h-50">
        <h2 className="text-2xl">결제 실패</h2>
        <div className="w-full h-0.5 bg-gray-300"></div>
        <div className="flex flex-col w-full ml-5">
          <p>
            결제에 실패했습니다. 문제가 지속될 경우 고객센터로 문의해주세요.
          </p>
          <p>{`에러 코드: ${errorCode}`}</p>
          <p>{`실패 사유: ${errorMessage}`}</p>
        </div>
      </div>
      <button
        onClick={onClickHomeBtn}
        className="mt-2 border border-gray-300 px-2 py-0.5 text-white bg-black rounded-sm"
      >
        홈페이지로 돌아가기
      </button>
    </div>
  );
}
