import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { Post, PostSchema } from './entities/post.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { PostResolver } from './post.resolver';
import { FileModule } from '../file/file.module';
import { PostController } from './post.controller';
import { RedisPubSubModule } from '../redis-pub-sub/redis-pub-sub.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
    FileModule,
    RedisPubSubModule,
    /* MessageModule, */
  ],
  providers: [PostService, PostResolver],
  exports: [PostService],
  controllers: [PostController],
})
export class PostModule {}
