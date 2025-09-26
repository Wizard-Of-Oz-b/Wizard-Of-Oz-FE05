import { useDeleteCartItem, usePatchCart } from "../../../hooks/cart/cartHook";
import CartLoadingSpin from "./CartLoadingSpin";
import CartStepper from "./CartStepper";
/**
 * 옵션 키 문자열을 사람이 읽기 좋은 형태로 변환합니다.
 * @param {string} optionKeyString - 예: "color=lightblue&size=M"
 * @returns {string} - 예: "색상: lightblue 사이즈: M"
 */
function formatOptionKey(optionKeyString) {
  // 1. 영문 key를 한글로 변환하기 위한 맵
  const keyTranslations = {
    color: "색상",
    size: "사이즈",
    // 필요에 따라 다른 옵션 키도 추가 가능
    // material: '소재',
  };

  // 2. URLSearchParams 객체 생성
  const params = new URLSearchParams(optionKeyString);

  const formattedParts = [];

  // 3. params를 순회하며 문자열 조립
  for (const [key, value] of params.entries()) {
    // 맵에서 한글 이름을 찾고, 없으면 원래 key를 사용
    const translatedKey = keyTranslations[key] || key;
    formattedParts.push(`${translatedKey}: ${value}`);
  }

  // 4. 배열을 공백으로 합쳐 최종 문자열 반환
  return formattedParts.join(" ");
}




//각 주문 카트 onChangeSelect, checkItems제거
export default function CartCard({ data }) {
  // 최대 수량인지 확인
  console.log(data.count, data.product);
  
  const {mutate: deleteMutaition, isPending } = useDeleteCartItem();
  const {mutate: updateCartQuantity, isPending: patchPending} = usePatchCart();
  
  const option = formatOptionKey(data.option_key)
  const handleOnClickDelete = () => {
    deleteMutaition({
      productId: data.product,
      optionKey: data.option_key,
    });
  };
    const onClickPatch = (itemId, option, newQuantity) => {
    console.log(updateCartQuantity);
    updateCartQuantity({
      id: itemId,
      updatedData: {
        quantity: newQuantity,
        option_key: option,
      },
    });
  };
  return (
    //사진 크기 키우기
    <div
      className="w-[1100px] py-4 border-b border-gray-200
    grid grid-cols-[1fr_100px_120px_120px_100px] gap-x-4 items-center"
    >
      {/* <input type="checkbox" name="selectAll" id="selectAll" 
      onChange={(e) => onChangeSelect(e.target.checked, data.product)}
      checked={checkItems.includes(data.product) ? true : false} 
      className="appearance-none box-borderbg-clip-content p-[0.25em] w-[1.5em] h-[1.5em] border border-gray-700 cursor-pointer
      checked:bg-black
      
      " /> */}
      {(isPending || patchPending) && <CartLoadingSpin />}

      <div className="flex justify-center items-center">
        <img
          src={`https://picsum.photos/id/1/160/225`}
          alt="상품 이미지"
          className="w-[140px] h-[190px]"
        />
        <div className="flex flex-col  w-[400px] ml-4">
          <p className="text-lg">{data.product_name}</p>
          <p className="text-gray-400">{option}</p>
        </div>
      </div>

      <CartStepper
        value={data.count}
        itemId={data.product}
        option={data.option_key}
        onChageValue={onClickPatch}
        max={data.quantity}
      />
      <p className="text-center">택배 배송</p>
      <p className="text-center">
        {(data.unit_price * data.count).toLocaleString()}원
      </p>
      <div className="flex flex-col">
        {/* <button className="border border-gray-300 mb-2 py-0.5">주문하기</button> */}
        <button
          className="border border-gray-300 py-0.5"
          // onClick={()=> setItemCount(data.product, data.option_key, 0)}
          onClick={handleOnClickDelete}
        >
          삭제
        </button>
      </div>
    </div>
  );
}
