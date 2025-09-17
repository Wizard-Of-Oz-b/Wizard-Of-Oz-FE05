export default function CartToolbar(){

  return(
    // <div className="flex items-center justify-between w-[900px]">
    //   <input type="checkbox" name="selectAll" id="selectAll" 
    //   className="appearance-none box-borderbg-clip-content p-[0.25em] w-[1.5em] h-[1.5em] border border-gray-700 cursor-pointer
    //   checked:bg-black
    //   flex-none" />

    //   <span className="flex-5 text-center">상품정보</span> 
    //   <span className="flex-2 text-center">수량</span>
    //   <span className="flex-2 text-center">배송구분</span>
    //   <span className="flex-2 text-center">합계</span>
    //   <span className="flex-2 text-center">선택</span>
    // </div>
    <div className="w-[1100px] py-3 border-t-2 border-b border-gray-200
    grid grid-cols-[auto_1fr_100px_120px_120px_100px] gap-x-4 items-center">
      <input type="checkbox" name="selectAll" id="selectAll" 
      className="appearance-none box-borderbg-clip-content p-[0.25em] w-[1.5em] h-[1.5em] border border-gray-700 cursor-pointer
      checked:bg-black
      " />

      <span className="text-center">상품정보</span> 
      <span className="text-center">수량</span>
      <span className="text-center">배송구분</span>
      <span className="text-center">합계</span>
      <span className="text-center">선택</span>
    </div>
  )
}