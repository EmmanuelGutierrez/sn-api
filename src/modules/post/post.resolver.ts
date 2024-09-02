import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { PostDataReturnDto } from './dto/post-data-return.dto';
import { FilterDto } from './dto/filter.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { CtxWithUserI } from 'src/common/models/token/reqWithToken.model';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { tokenInfoI } from 'src/common/models/token/token.model';
import { UpdatePostDto } from './dto/update-post.dto';
import { RedisPubSubService } from '../redis-pub-sub/redis-pub-sub.service';
import { SUB_NEW_POSTS } from 'src/common/constants/redis/sub-new-posts';
import { IsSubscription } from 'src/common/decorators/subscription.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Resolver()
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly redisPubSub: RedisPubSubService,
  ) {}
  @Mutation(() => Post, { name: 'createPost' })
  create(@Args('data') data: CreatePostDto, @Context() ctx: CtxWithUserI) {
    return this.postService.create(data, ctx.req.user.id);
  }

  @Query(() => PostDataReturnDto, { name: 'allPosts' })
  findAll(@Args('params') params: FilterDto) {
    return this.postService.findAll(params);
  }

  @IsSubscription()
  @Subscription(() => Post, {
    resolve: (payload: { subNewPosts: Post }) => {
      console.log(payload);
      return payload.subNewPosts;
    },
  })
  subNewPosts(
    // @Args('params') params: FilterDto,
    @CurrentUser() tokenData: tokenInfoI,
  ) {
    console.log('tokenData', tokenData);
    // return this.postService.findAll(params);
    return this.redisPubSub.asyncIterator(SUB_NEW_POSTS);
  }

  @Query(() => PostDataReturnDto, { name: 'mePosts' })
  findMe(
    @Args('params') params: FilterDto,
    @CurrentUser() tokenData: tokenInfoI,
  ) {
    return this.postService.me(params, tokenData.id);
  }

  @Query(() => Post, { name: 'getOne' })
  findOne(@Args('id') id: string) {
    return this.postService.findOne(id);
  }

  @Mutation(() => Post, { name: 'updatePost' })
  update(
    @Args('data') data: UpdatePostDto,
    @CurrentUser() tokenData: tokenInfoI,
  ) {
    return this.postService.update(data, tokenData.id);
  }
  @Mutation(() => Post, { name: 'updateReaction' })
  async updateReactions(
    @Args('id') id: string,
    @CurrentUser() tokenData: tokenInfoI,
  ) {
    return await this.postService.updateReactions(id, tokenData.id);
  }

  @Mutation(() => Post, { name: 'comment' })
  async commentPost(
    @Args('data') data: CreatePostDto,
    @Args('id') id: string,
    @CurrentUser() tokenData: tokenInfoI,
  ) {
    return await this.postService.commentPost(id, tokenData.id, data);
  }

  @Query(() => Post, { name: 'getComments' })
  async getCommentPost(@Args('id') id: string) {
    return await this.postService.getCommentsPost(id);
  }
}
