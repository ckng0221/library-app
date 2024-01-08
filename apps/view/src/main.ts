import { NestFactory } from '@nestjs/core';
import { ViewModule } from './view.module';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(ViewModule);

  const PORT = process.env.PORT;
  const loggingMode =
    process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(morgan(loggingMode));

  await app.listen(PORT);
}
bootstrap();
