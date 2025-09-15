import { ordersHandlers } from './orders';
import { couponsHandlers } from './coupons';
import { productsHandlers } from './products';
import { usersHandlers } from './users';
import { categoriesHandlers } from './categories';
import { ticketsHandlers } from './tickets';

export const handlers = [
  ...ordersHandlers,
  ...couponsHandlers,
  ...productsHandlers,
  ...usersHandlers,
  ...categoriesHandlers,
  ...ticketsHandlers,
];
