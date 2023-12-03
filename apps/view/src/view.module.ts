import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
   imports: [
    ServeStaticModule.forRoot({
      rootPath: 'ui/dist',
    }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'apps/view/.env' }),
  ],
  controllers: [],
  providers: [],
})
export class ViewModule {}
