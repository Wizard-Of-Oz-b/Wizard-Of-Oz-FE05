/**
 * 
 * @param {Array<object>} currentItems 장바구니 더미데이터(실제로 변경될 배열)
 * @param {string} product 수량을 조절할 아이디
 * @param {string} option_key 수량을 조절할 상품의 옵션
 * @param {number} newQuantity 수량
 * 
 */
export function adjustItems(currentItems, product, option_key, newQuantity) {
  const otherItems = currentItems.filter(item => item.product !==product || item.option_key !== option_key)

  const targetItem = currentItems.find(item => item.product === product && item.option_key === option_key)

  const newItemList =[]
  if(newQuantity > 0) {
    for(let i =0; i< newQuantity; i++){
      newItemList.push(targetItem)
    }
  }

  return[...otherItems, ...newItemList];
}