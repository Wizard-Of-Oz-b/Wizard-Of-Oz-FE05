import { FaCheckCircle } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
// data => 주소 정보, address1, address2, 이름, 연락처, address_id가 담겨 있다.
export default function UserAddressCard({ data, onSelect, select }) {
  console.log(data, "데이터");
  if (!data || !onSelect) {
    return;
  }
  const isSelect = select === data?.address_id
  const selectStyle =
    isSelect
      ? "border border-violet-200 bg-violet-100 shadow-xl"
      : "border border-neutral-300 bg-white hover:shadow-[inset_0_6px_10px_0_rgba(0,0,0,0.1)]";
  console.log(select);
  return (
    <div
      className={`flex h-[180px] rounded-lg px-3 py-1 ${selectStyle}`}
      onClick={() => onSelect(data?.address_id)}
    >
      <table className="w-full">
        <thead>
          <tr>
            <th className="flex justify-between">
              <span className="text-violet-900 mb-1.5">({data?.postcode})</span>
              {isSelect && <FaCheckCircle color="#44337a"/>}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <span className="text-neutral-900">{data?.address1}</span>
          </tr>
		  		<tr className="flex flex-col">
						<span className=" text-violet-600">상세 주소</span>
            <span className="text-neutral-900">{data?.address2}</span>
          </tr>
          <tr className="flex itmes-center">
            <FaUser />
            <span className="text-neutral-700 font-semibold ml-2">{data?.recipient}</span>
          </tr>
          <tr className="flex items-center">
            <FiPhone />
            <span className="text-neutral-700 ml-2">{data?.phone}</span>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
