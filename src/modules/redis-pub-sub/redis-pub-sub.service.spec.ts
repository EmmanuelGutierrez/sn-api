import { Test, TestingModule } from '@nestjs/testing';
import { RedisPubSubService } from './redis-pub-sub.service';

describe('RedisPubSubService', () => {
  let service: RedisPubSubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisPubSubService],
    }).compile();

    service = module.get<RedisPubSubService>(RedisPubSubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
