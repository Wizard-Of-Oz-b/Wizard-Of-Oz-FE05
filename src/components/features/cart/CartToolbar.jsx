export default function CartToolbar(
) {
  return (
      <tr className="py-3 border-t-2 border-b border-gray-200 align-middle">
        
        <th className="text-center">상품정보</th>

        <th className="w-[100px] text-center">수량</th>

        <th className="w-[120px] text-center">배송구분</th>

        <th className="w-[120px] text-center">합계</th>

        <th className="w-[100px] text-center">개별 삭제</th>
      </tr>
  );
}
