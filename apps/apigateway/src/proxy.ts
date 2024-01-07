import type * as express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { IRoute } from './routes';

export const setupProxies = (app: express.Application, routes: IRoute[]) => {
  routes.forEach((r) => {
    app.use(r.url, createProxyMiddleware(r.proxy));
  });
};
