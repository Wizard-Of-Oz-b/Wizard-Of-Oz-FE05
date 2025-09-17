
//각 주문 카트
export default function CartCard({data, setItemCount, selectItem}) {
  // 최대 수량인지 확인
  const price = 333333
  return(
    <div className="flex border border-gray-400">
      <img src={`https://picsum.photos/id/1/150/225`} alt="상품 이미지"  className="w-[150px] h-[225px]"/>

      <div className="flex flex-col w-[400px]">
        <p>상품명</p>
        <p>{price.toLocaleString()}원</p>
        <p>상품 수량 설정</p> 
      </div>
    </div>
  )
}
