export default function CartToolbar(
  // {
  // checkItemLength,
  // dataLength,
  // onChangeCheckbox,
// }
) {
  return(

    <div className="w-[1100px] py-3 border-t-2 border-b border-gray-200
    grid grid-cols-[1fr_100px_120px_120px_100px] 
    gap-x-4 items-center">

      {/* <input type="checkbox" name="selectAll" id="selectAll"
      onChange={(e) => onChangeCheckbox(e.target.checked)}
      checked={checkItemLength === dataLength ? true : false}
      className="appearance-none box-borderbg-clip-content p-[0.25em] w-[1.5em] h-[1.5em] border border-gray-700 cursor-pointer
      checked:bg-black
      " /> */}

      <span className="text-center">상품정보</span>
      <span className="text-center">수량</span>
      <span className="text-center">배송구분</span>
      <span className="text-center">합계</span>
      <span className="text-center">선택</span>
    </div>
  )

  // return (
  //   <thead>
  //     <tr className="py-3 border-t-2 border-b border-gray-200 align-middle">
  //       {/*
  //          체크박스 컬럼: grid-cols의 'auto'에 해당
  //          w-auto와 text-center를 추가하여 정렬을 맞춥니다.
  //        */}
  //       <th className="w-auto text-center">
  //         <input
  //           type="checkbox"
  //           name="selectAll"
  //           id="selectAll"
  //           onChange={(e) => onChangeCheckbox(e.target.checked)}
  //           checked={checkItemLength === dataLength}
  //           className="appearance-none box-border bg-clip-content p-[0.25em] w-[1.5em] h-[1.5em]
  //     border border-gray-700 cursor-pointer checked:bg-black"
  //         />
  //       </th>
  //       {/*
  //         상품정보 컬럼: grid-cols의 '1fr'에 해당
  //         너비를 지정하지 않으면 남은 공간을 모두 차지하게 됩니다.
  //       */}
  //       <th className="text-center">상품정보</th>

  //       {/* 수량 컬럼: grid-cols의 '100px'에 해당 */}
  //       <th className="w-[100px] text-center">수량</th>

  //       {/* 배송구분 컬럼: grid-cols의 '120px'에 해당 */}
  //       <th className="w-[120px] text-center">배송구분</th>

  //       {/* 합계 컬럼: grid-cols의 '120px'에 해당 */}
  //       <th className="w-[120px] text-center">합계</th>

  //       {/* 선택 컬럼: grid-cols의 '100px'에 해당 */}
  //       <th className="w-[100px] text-center">선택</th>
  //     </tr>
  //   </thead>
  // );
}
