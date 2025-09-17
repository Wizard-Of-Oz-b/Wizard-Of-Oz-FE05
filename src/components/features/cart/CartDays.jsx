export default function CartDays(){
  
  return(
    <div className="flex justify-center items-center border border-gray-200 bg-gray-200 w-full mt-2 py-6">
      <div className="flex flex-col mx-5 items-center">
        <span className="text-sm">장바구니에 담은 지 <b>90일이 지난 상품은 목록에서 삭제</b> 됩니다.</span>
      </div>
    </div>
  )
}