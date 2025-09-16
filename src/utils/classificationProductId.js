import { BOTTOM_CATEGORY, SHOES_CATEGORY, TOP_CATEGORY } from "../constants/categories";



/**
 * 상품 코드를 받아서 어떤 카테고리인지 반환
 * @param {number} code (상품코드) 
 * @returns {string[]} 카테고리 배열
 */
export function classificationProductId({code}) {
  const classification = []
  const gender = code /100;
  const group = code % 100 / 10
  const category = code % 10;

  switch(gender){
    case 1:
      classification.push('남성')
      break;
    case 2:
      classification.push('여성')
      break;
    default:
      return; //잘못된 코드
  }

  switch(group){
    case 1:
      classification.push('상의')
      classification.push(TOP_CATEGORY[category])
      break;
    case 2:
      classification.push('하의')
      classification.push(BOTTOM_CATEGORY[category])
      break;
    case 3:
      classification.push('신발')
      classification.push(SHOES_CATEGORY[category])
      break;

    default:
      return; //잘못된 코드
  }


  return classification;
}