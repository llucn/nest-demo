import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiController } from './api.controller';

@Module({
  imports: [ConfigModule],
  controllers: [ApiController],
})
export class ApiModule {}
