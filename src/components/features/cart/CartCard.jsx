import CartStepper from "./CartStepper"

//각 주문 카트
export default function CartCard({data, setItemCount, selectItem}) {
  // 최대 수량인지 확인
  const price = 333333
  return(
    //사진 크기 키우기
    <div className="w-full py-4 border-b border-gray-200
    grid grid-cols-[auto_1fr_100px_120px_120px_100px] gap-x-4 items-center">
      <input type="checkbox" name="selectAll" id="selectAll" 
      className="appearance-none box-borderbg-clip-content p-[0.25em] w-[1.5em] h-[1.5em] border border-gray-700 cursor-pointer
      checked:bg-black
      ml-3
      " />
      <div className="flex justify-center items-center">
        <img src={`https://picsum.photos/id/1/150/225`} alt="상품 이미지"  
        className="w-[140px] h-[215px]"/>
        <div className="flex flex-col  w-[400px] ml-4">
          <p>셔츠</p>
          <p>컬러: NAVY</p>
          <p>사이즈: XL</p>
        </div>
      </div>

        <CartStepper />
        <p className="text-center">선택</p>
        <p className="text-center">{price.toLocaleString()}원</p>
      <div className="flex flex-col">
        <button className="border border-gray-300 mb-2">주문하기</button>
        <button className="border border-gray-300">삭제</button>
      </div>
    </div>
  )
}
