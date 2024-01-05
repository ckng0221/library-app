import * as morgan from 'morgan';
import * as express from 'express';

const loggingMode = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

export const setupLogging = (app: express.Application) => {
  app.use(morgan(loggingMode));
};
