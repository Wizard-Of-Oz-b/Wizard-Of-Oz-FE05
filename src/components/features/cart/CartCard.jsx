import { useEffect, useState } from "react";
import { useDeleteCartItem, usePatchCart } from "../../../hooks/cart/useCart";
import formatOptionKey from "../../../utils/optionKey";
import { fetchPublicMainImageUrl } from "../../common/api/admin/productImagesPublic";
import CartLoadingSpin from "./CartLoadingSpin";
import CartStepper from "./CartStepper";
import { AnimatePresence, motion } from "framer-motion";
// import { useToasts } from "../../common/layouts/wishlist/hooks/useToasts";
import Toasts from "../../common/layouts/wishlist/components/Toasts";
import { useToastStore } from "../../../store/toast";
import userApi from "../../../lib/api/userAxios";

const FALLBACK_IMG = "public/images/product-fallback.png";
//각 주문 카트 onChangeSelect, checkItems제거
export default function CartCard({ data, view = "pc" }) {
  // 최대 수량인지 확인
  // console.log(data.count, data.product);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkLoading, setCheckLoading] = useState(false); //재고 체크
  const [itemCount, setItemCount] = useState(1);        // 실제 재고담기
  const { mutate: deleteMutaition, isPending } = useDeleteCartItem();
  const { mutate: updateCartQuantity, isPending: patchPending } =
    usePatchCart();
  const productsImg = fetchPublicMainImageUrl(data.product);
  const option = formatOptionKey(data.option_key);
  // const { toasts, pushToast } = useToasts();
  const { addToastList } = useToastStore();
  // #1 이미지 가져오기
  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      try {
        const url = await fetchPublicMainImageUrl(data?.product);
        setImageUrl(url);
      } catch (error) {
        console.error("이미지 URL을 가져오는 데 실패했습니다:", error);
        setImageUrl(FALLBACK_IMG);
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

  useEffect(() => {
    const stockCheck = async () => {
      try {
        const stock = await userApi.get("/product-stocks/", {
          params: {
            option_key: data.option_key,
            product_id: data.product,
          },
        });
        if (stock.data.length === 0 || stock.data[0]?.stock_quantity === 0) {
          //삭제 코드 넣기
          //토스트 출력
          deleteMutaition({
            productId: data.product,
            optionKey: data.option_key,
          });
          addToastList(`${data?.product_name} 재고가 없습니다.`);
          return;
        }
        console.log(stock.data[0].stock_quantity, '재고')
        setItemCount(stock.data[0].stock_quantity)
      } catch (error) {
        console.error(error);
      } finally {
        setCheckLoading(false);
      }
    };
    if (data) {
      stockCheck();
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

  const isCartCardLoading = isPending || patchPending || checkLoading;
  console.log(itemCount, '아이템 카운트')
  if (view === "card") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative"
        >
          {isCartCardLoading && <CartLoadingSpin />}
          <div className="flex items-start justify-between">
            <div className="flex items-center min-w-0">
              {isLoading ? (
                <div className="w-16 h-16 bg-gray-300 rounded-md mr-3 flex-shrink-0"></div>
              ) : (
                <img
                  src={imageUrl}
                  alt="상품 이미지"
                  className="w-16 h-23 object-cover rounded-md mr-3 flex-shrink-0"
                  onError={(e) => {
                    e.target.src = { FALLBACK_IMG };
                  }}
                />
              )}
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {data?.product_name}
                </p>
                <p className="text-sm text-gray-500">{option}</p>
              </div>
            </div>
            <button
              onClick={handleOnClickDelete}
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              ✕
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">수량</span>
              <CartStepper
                value={data?.quantity}
                itemId={data?.id}
                option={data?.option_key}
                onChageValue={onClickPatch}
                max={itemCount}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">배송구분</span>
              <span className="font-medium">택배 배송</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-bold">합계</span>
              <span className="font-semibold text-lg">
                {(data.unit_price * data.quantity).toLocaleString()}원
              </span>
            </div>
          </div>
          {/* <Toasts toasts={toasts} /> */}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.tr
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
      >
        {/* 상품 정보 */}
        <td>
          <div className="flex items-center">
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
            <div className="flex flex-col  w-[400px] ml-4">
              <p className="text-lg">{data?.product_name}</p>
              <p className="text-gray-400">{option}</p>
            </div>
          </div>
        </td>

        {/* 수량 */}
        <td>
          <CartStepper
            value={data?.quantity}
            itemId={data?.id}
            option={data?.option_key}
            onChageValue={onClickPatch}
            max={itemCount}
          />
        </td>

        {/* 배송구분 */}
        <td>
          <p className="text-center">택배 배송</p>
        </td>

        {/* 합계 액수 */}
        <td>
          <p className="text-center">
            {(data.unit_price * data.quantity).toLocaleString()}원
          </p>
        </td>

        {/* 삭제 */}
        <td>
          <button
            className="border border-gray-300 py-0.5 w-30"
            // onClick={()=> setItemCount(data.product, data.option_key, 0)}
            onClick={handleOnClickDelete}
          >
            삭제
          </button>
        </td>
        {/* <Toasts toasts={toasts} /> */}

        {isCartCardLoading && <CartLoadingSpin />}
      </motion.tr>
    </AnimatePresence>
  );
}
