import * as express from 'express';
import { setupLogging } from './logging';

const app = express();

setupLogging(app);

app.get('/', (req, res) => {
  return res.send('Welcome to API Gateway!');
});

export default app;
