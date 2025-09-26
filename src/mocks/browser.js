import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

worker.onUnhandledRequest = (req) => {
  if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(req.url)) {
    return; 
  }
  console.warn("MSW: unhandled request", req.method, req.url);
};