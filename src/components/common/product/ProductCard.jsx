import RatingStars from "./RatingStars";
import { KRW } from "../models/product";

// export default function ProductCard({ product, onClick }) {
export default function ProductCard({data}) {


  const onClickhandler = () => {
    console.log('move to detail')
  }

  return(
    <div className="flex flex-col cursor-pointer w-1/4  pb-8" onClick={onClickhandler}>
      <img src={`https://picsum.photos/id/${data.product_id}/400/600`} alt={data.name}/>
      <p className={`font-extralight ${data?.is_active? 'text-black': 'text-gray-400'}`}>{data.category_id}</p>
      <p className={`font-medium ${data?.is_active? 'text-black': 'text-gray-400'}`}>{data.name}</p>
      <p className={`font-bold ${data?.is_active? 'text-black': 'text-gray-400'}`}>{data.price.toLocaleString()}원</p>
      <span>{data?.is_active ? '' : '품절'}</span>
    </div>
  )







  // return (
  //   <button onClick={onClick} className="text-left rounded border border-gray-200 overflow-hidden bg-white hover:shadow-sm">
  //     <div className="aspect-[3/4] bg-gray-50">
  //       <img src={product.gallery?.[0]} alt={product.name} className="h-full w-full object-cover" />
  //     </div>
  //     <div className="p-3">
  //       <p className="text-xs text-gray-500">{product.brand}</p>
  //       <h3 className="mt-0.5 text-sm line-clamp-2">{product.name}</h3>
  //       <div className="mt-1">
  //         <RatingStars rating={product.rating} count={product.ratingCount} size={14} />
  //       </div>
  //       <div className="mt-1 font-medium">{KRW(product.price)}</div>

  //       {/* 색상 점프리뷰(최대 4개만) */}
  //       <div className="mt-2 flex gap-1">
  //         {(product.colors || []).slice(0, 4).map((c) => (
  //           <div key={c.code} className="h-3 w-3 rounded-full border border-gray-300" style={{ background: c.hex }} />
  //         ))}
  //       </div>
  //     </div>
  //   </button>
  // );
}
