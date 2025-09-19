import CartStepper from "./CartStepper"

//각 주문 카트
export default function CartCard({data, setItemCount, onChangeSelect, checkItems}) {
  // 최대 수량인지 확인
  console.log(data.count, data.product)
  return(
    //사진 크기 키우기
    <div className="w-full py-4 border-b border-gray-200
    grid grid-cols-[auto_1fr_100px_120px_120px_100px] gap-x-4 items-center">
      <input type="checkbox" name="selectAll" id="selectAll" 
      onChange={(e) => onChangeSelect(e.target.checked, data.product)}
      checked={checkItems.includes(data.product) ? true : false} 
      className="appearance-none box-borderbg-clip-content p-[0.25em] w-[1.5em] h-[1.5em] border border-gray-700 cursor-pointer
      checked:bg-black
      
      " />
      <div className="flex justify-center items-center">
        <img src={`https://picsum.photos/id/1/160/225`} alt="상품 이미지"  
        className="w-[140px] h-[190px]"/>
        <div className="flex flex-col  w-[400px] ml-4">
          <p className="text-lg">{data.product_name}</p>
          <p className="text-gray-400">{`[옵션: NAVY/XL]`}</p>

        </div>
      </div>

        <CartStepper 
        value={data.count}
        itemId={data.product}
        option={data.option_key}
        onChageValue={setItemCount}
        max={data.quantity}
        />
        <p className="text-center">택배 배송</p>
        <p className="text-center">{(data.unit_price * data.count).toLocaleString()}원</p>
      <div className="flex flex-col">
        <button className="border border-gray-300 mb-2 py-0.5">주문하기</button>
        <button className="border border-gray-300 py-0.5">삭제</button>
      </div>
    </div>
  )
}
