import { NestFactory } from '@nestjs/core';
import { ViewModule } from './view.module';

async function bootstrap() {
  const app = await NestFactory.create(ViewModule);

  const PORT = process.env.PORT
  await app.listen(PORT);
}
bootstrap();
