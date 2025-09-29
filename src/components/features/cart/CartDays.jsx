export default function CartDays() {
  return (
    <td colSpan={5} className="bg-gray-200 border-y-8 border-white py-1">
      <div className="flex flex-col mx-5 items-center">
        <span className="text-sm">
          장바구니에 담은 지 <b>90일이 지난 상품은 목록에서 삭제</b> 됩니다.
        </span>
      </div>
    </td>
  );

  // return (
  //   <div className="flex justify-center items-center border border-gray-200 bg-gray-200 w-[1100px] mt-2 py-6">
  //     <div className="flex flex-col mx-5 items-center">
  //       <span className="text-sm">
  //         장바구니에 담은 지 <b>90일이 지난 상품은 목록에서 삭제</b> 됩니다.
  //       </span>
  //     </div>
  //   </div>
  // );
}
