
/**
 * 쿼리 객체 를 입력 받으면 null, 빈문자열, undefined를 제외하고 키값을 쿼리스트링으로 변환해 반환한다.
 * 각 요소는 필수 값은 아니다.
 * @param {object} {q: string , category_id: number, is_active: bool, sort: string , page: number, size: number  }
 * @returns {string} "q='검색값&category_id=111......."
 */
export function createQueryString(query) {
  const queries = {}

  for(const key in query){
    const value = query[key]
    if(value !==null && value !== '' && value !== undefined){
      queries[key] = value
    }
  }

  return new URLSearchParams(queries).toString();

}