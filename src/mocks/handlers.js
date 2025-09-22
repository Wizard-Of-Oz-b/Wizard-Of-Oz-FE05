import { http, HttpResponse } from "msw";
import { dummyProduct } from "./dummyProducts";

export const handlers = [
  http.get("/api/v1/products", ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");

    if (q === "dummy") {
      return HttpResponse.json(dummyProduct);
    }

    return;
  }),
];
