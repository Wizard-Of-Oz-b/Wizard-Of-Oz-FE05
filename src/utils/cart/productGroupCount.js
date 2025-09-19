
/**
 * 
 * @param {Object} 카트데이터 추가
 * @returns {Object} 카트데이터별로 그룹화 하고 count 추가
 */
export function productGroupCount(data) {
  const groupData = data.reduce((acc, item) => {
    const key = `${item.product}-${item.option_key}`
    const group =  acc[key] ?? []
    acc[key] = [...group, item]
    return acc
  }, {})

  return Object.values(groupData).map(group =>({
    ...group[0],
    count: group.length
  }))
  
}