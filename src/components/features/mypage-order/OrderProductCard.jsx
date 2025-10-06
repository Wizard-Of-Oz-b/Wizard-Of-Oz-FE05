import { useEffect, useState } from "react";
import { fetchPublicMainImageUrl } from "../../common/api/admin/productImagesPublic";
import formatOptionKey from "../../../utils/optionKey";

export default function OrderProductCard({ data, view = "pc" }) {
  // 상품 출력 .. 상품 이미지 가져올것!
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const option = formatOptionKey(data.option_key);
  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      try {
        const url = await fetchPublicMainImageUrl(data?.product_id);
        setImageUrl(url);
        if (url === null) {
          setImageUrl("https://placehold.co/400x600");
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

  if (view === "card") {
    return (
      <div className="py-4">
        {/* 상품 기본 정보 */}
        <div className="flex items-center">
          {isLoading ? (
            <div className="w-20 h-24 bg-gray-300 rounded-md animate-pulse"></div>
          ) : (
            <img
              src={imageUrl}
              alt={data?.product_name}
              className="w-20 h-24 object-cover 
      rounded-md"
            />
          )}
          <div className="ml-4">
            <p className="font-medium">{data?.product_name}</p>
            <p className="text-sm text-gray-500">{option}</p>
          </div>
        </div>
        {/* 가격, 수량, 합계 정보 */}
        <div className="mt-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-600">개당 가격</span>
            <span>{Number(data?.unit_price).toLocaleString()} 원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">수량</span>
            <span>{data?.quantity} 개</span>
          </div>
          <div className="flex justify-between font-semibold text-base mt-1">
            <span>합계</span>
            <span>
              {(
                Number(data?.quantity) * Number(data?.unit_price)
              ).toLocaleString()}{" "}
              원
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <tr className="border-b border-neutral-300 last:border-b-0">
      <td className="p-4">
        <div className="flex items-center">
          {isLoading ? (
            <div className="w-20 h-30 bg-gray-300 mr-3"></div>
          ) : (
            <img src={imageUrl} alt="이미지" className="w-20 h-30 mr-3" />
          )}
          <div className="flex flex-col">
            <span>{data?.product_name}</span>
            <span className="text-sm text-gray-400">{option}</span>
            <span className="text-gray-600">개당 가격</span>
            <span className="">
              {Number(data?.unit_price).toLocaleString()} 원
            </span>
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
