import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { config } from 'src/common/config/config';

@Injectable()
export class RedisPubSubService extends RedisPubSub implements OnModuleInit {
  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {
    super({
      connection: {
        host: configService.redis.host,
        port: configService.redis.port,
        db: configService.redis.db,
        password: configService.redis.password,
      },
    });
  }
  async onModuleInit() {
    console.log('Init');
  }
}
