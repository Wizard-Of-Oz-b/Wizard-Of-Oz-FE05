export default function CartToolbar(
  // {
  // checkItemLength,
  // dataLength,
  // onChangeCheckbox,
// }
) {
  // return(

  //   <div className="w-[1100px] py-3 border-t-2 border-b border-gray-200
  //   grid grid-cols-[1fr_100px_120px_120px_100px] 
  //   gap-x-4 items-center">

  //     {/* <input type="checkbox" name="selectAll" id="selectAll"
  //     onChange={(e) => onChangeCheckbox(e.target.checked)}
  //     checked={checkItemLength === dataLength ? true : false}
  //     className="appearance-none box-borderbg-clip-content p-[0.25em] w-[1.5em] h-[1.5em] border border-gray-700 cursor-pointer
  //     checked:bg-black
  //     " /> */}

  //     <span className="text-center">상품정보</span>
  //     <span className="text-center">수량</span>
  //     <span className="text-center">배송구분</span>
  //     <span className="text-center">합계</span>
  //     <span className="text-center">선택</span>
  //   </div>
  // )

  return (
      <tr className="py-3 border-t-2 border-b border-gray-200 align-middle">
        
        <th className="text-center">상품정보</th>

        <th className="w-[100px] text-center">수량</th>

        <th className="w-[120px] text-center">배송구분</th>

        <th className="w-[120px] text-center">합계</th>

        <th className="w-[100px] text-center">개별 삭제</th>
      </tr>
  );
}
