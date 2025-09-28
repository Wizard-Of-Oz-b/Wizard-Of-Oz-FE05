export default function TelNumber({ value, onChange, isDefaultAddress }) {
  const handlePhoneChange = (e) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/[^0-9]/g, "");

    const formattedPhoneNumber = inputValue.replace(
      /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,
      "$1-$2-$3"
    );
    onChange(formattedPhoneNumber);
  };

  return (
    <div className="flex mt-3">
      <label htmlFor="phone" className="w-20">연락처</label>
      <input
        type="tel"
        id="phone"
        name="phone"
        value={value}
        className="w-full border border-gray-400 rounded-sm px-2 py-1"
        onChange={handlePhoneChange}
        maxLength="13"
        placeholder="전화번호를 입력하세요"
        required // form 제출 시 필수 항목으로 지정
        readOnly={isDefaultAddress}
      />
    </div>
  );
}
