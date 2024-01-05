import * as cors from 'cors';
import 'dotenv/config';
import * as express from 'express';
import { setupLogging } from './logging';
import { setupProxies } from './proxy';
import { ROUTES } from './routes';

const app = express();

const corsOptions: cors.CorsOptions = {
  // origin: '*',
  // credentials: true, //access-control-allow-credentials:true
  // optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

setupProxies(app, ROUTES);
setupLogging(app);

app.get('/', (req, res) => {
  return res.send('Welcome to API Gateway!');
});

export default app;
