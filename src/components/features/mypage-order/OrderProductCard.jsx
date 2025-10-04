import { useEffect, useState } from "react";
import { fetchPublicMainImageUrl } from "../../common/api/admin/productImagesPublic";
import formatOptionKey from "../../../utils/optionKey";

export default function OrderProductCard({ data }) {
  // 상품 출력 .. 상품 이미지 가져올것!
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const option =  formatOptionKey(data.option_key)
  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      try {
        const url = await fetchPublicMainImageUrl(data?.product_id);
        setImageUrl(url);
        if(url === null){
          setImageUrl("https://placehold.co/400x600")
        }
      } catch (error) {
        console.error("이미지 URL을 가져오는 데 실패했습니다:", error);
        setImageUrl("https://placehold.co/400x600");
      } finally {
        setIsLoading(false);
      }
    };
    //data 있을때만
    if (data) {
      loadImage();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (!data) {
    return;
  }

  return (
    <tr className="border-b border-neutral-300 last:border-b-0">
      <td className="p-4">
        <div className="flex items-center">
          {isLoading ? (
            <div className="w-20 h-30 bg-gray-300 mr-3"></div>
          ):
          (<img
            src={imageUrl}
            alt="이미지"
            className="w-20 h-30 mr-3"
          />)
          }
          <div className="flex flex-col">
            <span>{data?.product_name}</span>
            <span className="text-sm text-gray-400">{option}</span>
            <span className="">개당{Number(data?.unit_price).toLocaleString()} 원</span>
          </div>
        </div>
      </td>
      <td className="p-2 text-center w-24">{data?.quantity}개</td>
      <td className="p-4 text-right w-32">
        {(Number(data?.quantity) * Number(data?.unit_price)).toLocaleString()}{" "}
        원
      </td>
    </tr>
  );
}