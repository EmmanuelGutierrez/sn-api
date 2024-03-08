import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { Post, PostSchema } from './entities/post.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { PostResolver } from './post.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
    /* MessageModule, */
  ],
  providers: [PostService, PostResolver],
  exports: [PostService],
})
export class PostModule {}
