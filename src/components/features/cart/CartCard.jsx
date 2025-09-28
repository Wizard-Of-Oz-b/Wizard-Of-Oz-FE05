import { useEffect, useState } from "react";
import { useDeleteCartItem, usePatchCart } from "../../../hooks/cart/useCart";
import formatOptionKey from "../../../utils/optionKey";
import { fetchPublicMainImageUrl } from "../../common/api/admin/productImagesPublic";
import CartLoadingSpin from "./CartLoadingSpin";
import CartStepper from "./CartStepper";

//각 주문 카트 onChangeSelect, checkItems제거
export default function CartCard({ data }) {
  // 최대 수량인지 확인
  // console.log(data.count, data.product);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { mutate: deleteMutaition, isPending } = useDeleteCartItem();
  const { mutate: updateCartQuantity, isPending: patchPending } =
    usePatchCart();
  const productsImg = fetchPublicMainImageUrl(data.product);
  const option = formatOptionKey(data.option_key);

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      try {
        const url = await fetchPublicMainImageUrl(data?.product);
        setImageUrl(url);
      } catch (error) {
        console.error("이미지 URL을 가져오는 데 실패했습니다:", error);
        setImageUrl("https://picsum.photos/id/1/160/225");
      } finally {
        setIsLoading(false);
      }
    };

    if (data?.product) {
      loadImage();
    } else {
      setIsLoading(false);
    }
  }, []);

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
  console.log(productsImg.result);
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
        <div className="w-[140px h-[190px]">
          {isLoading ? (
            <div className="w-[140px] h-[190px] bg-gray-300"></div>
          ) : (
            <img
              src={imageUrl}
              onError={(e) => {
                e.target.src = "https://picsum.photos/id/1/160/225"; //이미지 없으면
              }}
              alt="상품 이미지"
              className="w-[140px] h-[190px]"
            />
          )}
        </div>
        <div className="flex flex-col  w-[400px] ml-4">
          <p className="text-lg">{data.product_name}</p>
          <p className="text-gray-400">{option}</p>
        </div>
      </div>

      <CartStepper
        value={data.quantity}
        itemId={data.id}
        option={data.option_key}
        onChageValue={onClickPatch}
      />
      <p className="text-center">택배 배송</p>
      <p className="text-center">
        {(data.unit_price * data.quantity).toLocaleString()}원
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
