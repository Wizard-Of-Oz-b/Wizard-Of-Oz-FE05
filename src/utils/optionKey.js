/**
 * 옵션 키 문자열을 사람이 읽기 좋은 형태로 변환합니다.
 * @param {string} optionKeyString - 예: "color=lightblue&size=M"
 * @returns {string} - 예: "색상: lightblue 사이즈: M"
 */
export default function formatOptionKey(optionKeyString) {
  // 1. 영문 key를 한글로 변환하기 위한 맵
  const keyTranslations = {
    color: "색상",
    size: "사이즈",
    // 필요에 따라 다른 옵션 키도 추가 가능
    // material: '소재',
  };

  // 2. URLSearchParams 객체 생성
  const params = new URLSearchParams(optionKeyString);

  const formattedParts = [];

  // 3. params를 순회하며 문자열 조립
  for (const [key, value] of params.entries()) {
    // 맵에서 한글 이름을 찾고, 없으면 원래 key를 사용
    const translatedKey = keyTranslations[key] || key;
    formattedParts.push(`${translatedKey}: ${value}`);
  }

  // 4. 배열을 공백으로 합쳐 최종 문자열 반환
  return formattedParts.join(" ");
}
