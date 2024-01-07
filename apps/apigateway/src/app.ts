import * as compression from 'compression';
import * as cors from 'cors';
import 'dotenv/config';
import * as express from 'express';
import helmet from 'helmet';
import { setupLogging } from './logging';
import { setupProxies } from './proxy';
import { ROUTES } from './routes';

const app = express();

const allowedOrigins = [process.env.BASEURL_VIEW || 'http://localhost:8000'];

if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push(process.env.BASEURL_UI || 'http://localhost:3000');
}

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true, //access-control-allow-credentials:true
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.disable('x-powered-by');

setupLogging(app);
setupProxies(app, ROUTES);

app.get('/', (req, res) => {
  return res.send('Welcome to API Gateway!');
});

export default app;
