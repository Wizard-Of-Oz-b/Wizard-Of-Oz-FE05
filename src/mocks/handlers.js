import { http, HttpResponse } from "msw";
import { dummyProduct } from "./dummyProducts";
import { dummyCart } from "./dummy/dummyCart";
import { adjustItems } from "./utils/adjustItems";

const CART_BASE_URL = '/api/v1/carts'
export const handlers = [
  http.get("/api/v1/products", ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");

    if (q === "dummy") {
      return HttpResponse.json(dummyProduct);
    }

    return;
  }),

  http.get("/api/products", () => {
    return HttpResponse.json([
      { id: "p1", name: "Basic Tee", price: 12900 },
      { id: "p2", name: "Denim Pants", price: 39900 },
    ]);
  }),

  http.get('/api/v1/products', () => {

    return HttpResponse.json(dummyProduct, {status: 200})
  }),


  /**
   * 여기서 부터카트 관련 요청
   */
  http.get(`${CART_BASE_URL}/me`, () => {

    return HttpResponse.json(dummyCart, {status: 200});
    //에러는 {status: 401} 자격인증 실패
  }),
  http.delete(`${CART_BASE_URL}/items/:item_id?option_key`, async ({ params }) =>{
    // 카트 삭제
    //성공시 204
    try {
      const { item_id, option_key } = params;
      dummyCart.items = adjustItems(dummyCart.items, item_id, option_key, 0);
      return HttpResponse.json({status:204})
    } catch (error) {
      console.error(error)
    }
  }),
  http.patch(`${CART_BASE_URL}/items/:item_id`, async ({request, params}) => {
    try {
      const{ item_id } = params;
      console.log(item_id, '아이디 테스트');
      const requestBody = await request.json();
      dummyCart.items = adjustItems(dummyCart.items, item_id, requestBody.option_key, requestBody.quantity)
      console.log('수량 조절')
      console.log(requestBody);
      return HttpResponse.json({},{status:200})

    } catch (error) {
      console.error(error)
      if(error instanceof Error){
        throw error
      }else{
        throw new Error(String(error))
      }
    }
    //수량 조절
    // {
    //   "quantity": 3
    // }
    // 성공 200
    //에러는 {status: 401} 자격인증 실패

  }),
  http.post(`${CART_BASE_URL}/items`,() =>{
    //장바구니 추가?
    // {
      // "product": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      // "options": "string",
      // "quantity": 1
    // }
    // 성공 201
  })

];
