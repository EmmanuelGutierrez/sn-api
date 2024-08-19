import { Test, TestingModule } from '@nestjs/testing';
import { ImageResolver } from './file.resolver';
import { ImageService } from './file.service';

describe('ImageResolver', () => {
  let resolver: ImageResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageResolver, ImageService],
    }).compile();

    resolver = module.get<ImageResolver>(ImageResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
