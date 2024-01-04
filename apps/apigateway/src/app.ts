import 'dotenv/config';
import * as express from 'express';
import { setupLogging } from './logging';
import { setupProxies } from './proxy';
import { ROUTES } from './routes';

const app = express();

setupLogging(app);
setupProxies(app, ROUTES);

app.get('/', (req, res) => {
  return res.send('Welcome to API Gateway!');
});

export default app;
