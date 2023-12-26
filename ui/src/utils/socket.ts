import { io } from 'socket.io-client';

const PAYMENT_URL =
  process.env.NODE_ENV === 'production'
    ? undefined
    : import.meta.env.VITE_PAYMENT_API_BASE_URL;

export const paymentSocket = io(PAYMENT_URL);
