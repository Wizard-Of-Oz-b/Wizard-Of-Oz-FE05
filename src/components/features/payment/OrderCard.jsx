import { useEffect, useState } from "react";
import formatOptionKey from "../../../utils/optionKey";
import { fetchPublicMainImageUrl } from "../../common/api/admin/productImagesPublic";

export default function Ordercard({ data }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const optionString = formatOptionKey(data?.option_key);
  const sumPrice = data?.unit_price * data?.quantity;
  const unitPrice = Math.floor(data?.unit_price);
  console.log(data)
  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      try {
        const url = await fetchPublicMainImageUrl(data?.product_id);
        setImageUrl(url);
      } catch (error) {
        console.error("이미지 URL을 가져오는 데 실패했습니다:", error);
        setImageUrl("https://picsum.photos/id/1/160/225");
      } finally {
        setIsLoading(false);
      }
    };
    //data 안에 프로덕트 아이디가 있을때만 가져온다.
    if (data?.product_id) {
      loadImage();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (!data) {
    return;
  }

  return (
    <div className="flex mt-2 border-t pt-3 border-gray-300">
      {isLoading ? (
        <div className="w-[70px] h-[90px] bg-gray-300"></div>
      ) : (
        <img
          src={imageUrl}
          onError={(e) => {
            e.target.src = "https://picsum.photos/id/1/50/70"; //이미지 없으면 이걸로
          }}
          className="w-[70px] h-[90px]"
        />
      )}
      <div className="flex flex-col ml-3">
        <span>{data?.product_name}</span>
        <span className="text-gray-500">[옵션] {optionString}</span>
        <span>개당 가격: {unitPrice.toLocaleString()}원</span>
        <span>구매 개수: {data?.quantity}</span>
        <span className="mt-3">합계: {sumPrice.toLocaleString()}원</span>
      </div>
    </div>
  );
}
