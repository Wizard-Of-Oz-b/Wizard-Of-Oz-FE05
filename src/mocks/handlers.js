// msw 연습용

import { http, HttpResponse } from "msw";
import { dummyProduct } from "./dummyProducts";

export const handlers = [
  // GET /api/user
  http.get("/api/user", () => {
    return HttpResponse.json({
      id: 1,
      name: "Kyung Bok",
      balance: 10000,
      role: "user",
    });
  }),

  http.post("/api/login", async ({ request }) => {
    const body = await request.json();
    const { username, password } = body || {};

    if (username === "admin" && password === "1234") {
      return HttpResponse.json({ token: "fake-jwt-token", role: "admin" });
    }
    return new HttpResponse("Unauthorized", { status: 401 });
  }),

  http.get("/api/products", () => {
    return HttpResponse.json([
      { id: "p1", name: "Basic Tee", price: 12900 },
      { id: "p2", name: "Denim Pants", price: 39900 },
    ]);
  }),

  http.get('/api/v1/products', () => {

    return HttpResponse.json(dummyProduct)
  })
];
