// 재고부족: product:1 .... 메시지 분리

export function parseStockError(message) {
  const result = {};

  if (typeof message !== "string" || !message.includes("재고 부족")) {
    return message;
  }

  // :  ,기준으로 데이터 잘라냄
  const dataString = message.substring(message.lastIndexOf(": ") + 2);
  const pairs = dataString.split(", ");

  pairs.forEach((pair) => {
    const EqualIndex = pair.indexOf("=");

    if (EqualIndex !== -1) {
      const key = pair.substring(0, EqualIndex);
      const value = pair.substring(EqualIndex + 1);

      result[key] = value;
    }
  });
  console.log(result, '파싱')
  return result;
}
