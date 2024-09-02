import { Module } from '@nestjs/common';
import { RedisPubSubService } from './redis-pub-sub.service';

@Module({
  providers: [RedisPubSubService],
  exports: [RedisPubSubService],
})
export class RedisPubSubModule {}
