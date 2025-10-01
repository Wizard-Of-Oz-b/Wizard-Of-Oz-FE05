// data => 주소 정보, address1, address2, 이름, 연락처, address_id가 담겨 있다.
export default function UserAddressCard({ data, onSelect, select }) {
  console.log(data, "데이터");
  if (!data || !onSelect) {
    return;
  }
  const selectStyle =
    select === data?.address_id
      ? "border-2 border-violet-800 shadow-xl"
      : "border border-black hover:shadow-[inset_0_6px_10px_0_rgba(0,0,0,0.1)]";
  console.log(select);
  return (
    <div
      className={`flex w-[500px] h-[150px] rounded-lg px-3 py-1 ${selectStyle}`}
      onClick={() => onSelect(data?.address_id)}
    >
      <table>
        <thead>
          <tr>
            <th className="flex">
              <span className="text-violet-900 mb-1.5">({data?.postcode})</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
						<span className="border border-violet-300 text-violet-600 px-4 mr-2"> 주 소 </span>
            <span className="text-neutral-500">{data?.address1}</span>
          </tr>
		  		<tr>
						<span className="border border-violet-300 text-violet-600 px-1 mr-2">상세 주소</span>
            <span className="text-neutral-500">{data?.address2}</span>
          </tr>
          <tr>
            <span className="text-neutral-700 font-semibold ml-0.5">{data?.recipient} - </span>
            <span className="text-neutral-700">{data?.phone}</span>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
