import 'dotenv/config';
import { Options } from 'http-proxy-middleware';

export interface IRoute {
  url: string;
  auth?: boolean;
  creditCheck?: boolean;
  rateLimit?: { windowMs: number; max: number };
  proxy: Options;
}

const BASEURL_BOOK = process.env.BASEURL_BOOK;
const BASEURL_CUSTOMER = process.env.BASEURL_CUSTOMER;
const BASEURL_BORROWING = process.env.BASEURL_BORROWING;
const BASEURL_PAYMENT = process.env.BASEURL_PAYMENT;

export const ROUTES: IRoute[] = [
  // Book
  {
    url: '/api/book',
    auth: false,
    creditCheck: false,
    proxy: {
      target: BASEURL_BOOK,
      changeOrigin: true,
      pathRewrite: {
        '^/api/book': '',
      },
    },
  },
  // Customer
  {
    url: '/api/customer',
    auth: false,
    creditCheck: false,
    proxy: {
      target: BASEURL_CUSTOMER,
      changeOrigin: true,
      pathRewrite: {
        '^/api/customer': '',
      },
    },
  },
  // Borrowing
  {
    url: '/api/borrowing',
    auth: false,
    creditCheck: false,
    proxy: {
      target: BASEURL_BORROWING,
      changeOrigin: true,
      pathRewrite: {
        '^/api/borrowing': '',
      },
    },
  },
  // Paymenet
  {
    url: '/api/payment',
    auth: false,
    creditCheck: false,
    proxy: {
      target: BASEURL_PAYMENT,
      changeOrigin: true,
      pathRewrite: {
        '^/api/payment': '',
      },
    },
  },
  // Socket
  {
    url: '/socket.io',
    auth: false,
    creditCheck: false,
    proxy: {
      target: BASEURL_PAYMENT,
      changeOrigin: true,
      ws: false,
    },
  },
];

// export const ROUTES: IRoute[] = [
//   {
//     url: '/free',
//     auth: false,
//     creditCheck: false,
//     rateLimit: {
//       windowMs: 15 * 60 * 1000,
//       max: 5,
//     },
//     proxy: {
//       target: 'https://www.google.com',
//       changeOrigin: true,
//       pathRewrite: {
//         [`^/free`]: '',
//       },
//     },
//   },
//   {
//     url: '/premium',
//     auth: true,
//     creditCheck: true,
//     proxy: {
//       target: 'https://www.google.com',
//       changeOrigin: true,
//       pathRewrite: {
//         [`^/premium`]: '',
//       },
//     },
//   },
// ];
