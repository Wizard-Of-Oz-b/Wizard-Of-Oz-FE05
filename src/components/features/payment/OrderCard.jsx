import formatOptionKey from "../../../utils/optionKey";
import { fetchPublicMainImageUrl } from "../../common/api/admin/productImagesPublic";

export default function Ordercard({data}) {
  if(!data){
    return;
  }
  const productsImg = fetchPublicMainImageUrl(data?.product)
  const optionString = formatOptionKey(data?.option_key)
  const sumPrice = data?.unit_price * data?.amount
  const unitPrice = Math.floor(data?.unit_price)

  return (
    <div className="flex mt-2 border-t pt-3 border-gray-300">
      <img
        src={productsImg}
        onError={(e) =>{
          e.target.src = 'https://picsum.photos/id/1/50/70' //이미지 없으면 이걸로
        }}
        className="w-[70px] h-[90px]"
      />
      <div className="flex flex-col ml-3">
        <span>{data?.product_name}</span>
        <span className="text-gray-500">[옵션] {optionString}</span>
        <span>개당 가격: {unitPrice.toLocaleString()}원</span>
        <span>구매 개수: {data?.amount}</span>
        <span className="mt-3">합계: {sumPrice.toLocaleString()}원</span>
      </div>
    </div>
  );
}
