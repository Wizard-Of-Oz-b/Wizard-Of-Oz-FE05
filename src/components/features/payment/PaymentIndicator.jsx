
/**
 * 
 * 이 컴포넌트의 애니메이션 로직은 codepen 사이트에서 참고해서
 * react, tailwindcss로 리팩토링한 결과 입니다.
 * original source by Zakari Abdessamad : https://codepen.io/vanderzak/pen/GROgExV?editors=1111
 */
export default function PaymentIndicator({ status = "loading" }) {
  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isFail = status === "fail";

  const indicatorStyle = `relative inline-block w-16 h-16 rounded-full border-[5px] ${
    isLoading &&
    "border-blue-500 border-t-transparent animate-[loader_spin_1s_linear_infinite]"
  }
  ${
    isSuccess &&
    "border-green-500 animate-[fade_in_bck_0.6s_cubic-bezier(0.390,0.575,0.565,1.000)_both]"
  }
  ${
    isFail &&
    "border-red-500 animate-[fade_in_bck_0.6s_cubic-bezier(0.390,0.575,0.565,1.000)_both]"
  }`;

  const iconStyle = `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10`;

  const iconAnimation = `animate-[scale_in_center_0.5s_cubic-bezier(0.250,0.460,0.450,0.940)_both]`;

  return (
    <div className={indicatorStyle}>

      {/* 성공 아이콘 */}
      <svg
        className={`${iconStyle} text-violet-500 ${
          isSuccess ? `block ${iconAnimation}` : "hidden"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          d="M5 13l4 4L19 7"
        />
      </svg>

      {/* 실패 아이콘 */}
      <svg
        className={`${iconStyle} text-red-500 ${
          isFail? `block ${iconAnimation}` : "hidden"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
  );
}
