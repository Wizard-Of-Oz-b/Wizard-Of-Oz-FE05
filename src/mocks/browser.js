import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// msw 는 나랑 안맞나봐 ㅠㅠ
