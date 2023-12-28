import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: resolve('dist/apps/ui'),
    }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'apps/view/.env' }),
  ],
  controllers: [],
  providers: [],
})
export class ViewModule {}
