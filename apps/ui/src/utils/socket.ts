import { io } from 'socket.io-client';

const PAYMENT_URL = import.meta.env.VITE_PAYMENT_API_BASE_URL;

export const paymentSocket = io(PAYMENT_URL, {
  path: '/api/payment/socket.io',
});
