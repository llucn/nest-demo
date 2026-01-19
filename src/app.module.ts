import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { ApiModule } from './api/api.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [CatsModule, ApiModule, UploadModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
