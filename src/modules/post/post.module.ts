import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { Post, PostSchema } from './entities/post.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { PostResolver } from './post.resolver';
import { FileModule } from '../file/file.module';
import { PostController } from './post.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
    FileModule,
    /* MessageModule, */
  ],
  providers: [PostService, PostResolver],
  exports: [PostService],
  controllers: [PostController],
})
export class PostModule {}
