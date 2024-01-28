import 'dotenv/config';
import { Options } from 'http-proxy-middleware';
// import type * as http from 'http';
// import type * as express from 'express';

export interface IRoute {
  url: string;
  auth?: boolean;
  creditCheck?: boolean;
  rateLimit?: { windowMs: number; max: number };
  proxy: Options;
}

const BASEURL_BOOK = process.env.BASEURL_BOOK || 'http://localhost:8001';
const BASEURL_CUSTOMER =
  process.env.BASEURL_CUSTOMER || 'http://localhost:8002';
const BASEURL_BORROWING =
  process.env.BASEURL_BORROWING || 'http://localhost:8003';
const BASEURL_PAYMENT = process.env.BASEURL_PAYMENT || 'http://localhost:8004';

// function removeXPowerByHeader(
//   proxyRes: http.IncomingMessage,
//   // req: express.Request,
//   // res: express.Response,
// ) {
//   // Note: headers strating from (server) res -> proxyRes
//   delete proxyRes.headers['x-powered-by'];
//   console.log(proxyRes.statusCode);

//   // proxyRes.headers['access-control-allow-origin'] = 'http://localhost:8000';
// }

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
      // onProxyRes: removeXPowerByHeader,
    },
  },
  // Customer
  {
    url: '/api/customer',
    auth: true,
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
      ws: false, // use http polling
      pathRewrite: {
        '^/api/payment': '',
      },
    },
  },
];
