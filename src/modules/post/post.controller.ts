import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { MongoIdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { FilterDto } from './dto/filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CommentPostDto } from './dto/comment-post.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ReqWithUserI } from 'src/common/models/token/reqWithToken.model';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  create(@Body() createPostDto: CreatePostDto, @Req() req: ReqWithUserI) {
    return this.postService.create(createPostDto, req.user.id);
  }

  //@Roles(roles.ADMIN)
  @Public()
  @Get('get-all')
  findAll(@Query() params: FilterDto) {
    return this.postService.findAll(params);
  }

  @Get('me')
  findMe(@Query() params: FilterDto, @Req() req: ReqWithUserI) {
    return this.postService.me(params, req.user.id);
  }

  @Get('get-one/:id')
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.postService.findOne(id);
  }

  @Put('update/:id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: ReqWithUserI,
  ) {
    return this.postService.update(id, updatePostDto, req.user.id);
  }
  @Put('update-reactions/:id')
  async updateReactions(
    @Param('id', MongoIdPipe) id: string,
    @Req() req: ReqWithUserI,
  ) {
    return await this.postService.updateReactions(id, req.user.id);
  }

  @Post('comment/:id')
  async commentPost(
    @Param('id', MongoIdPipe) id: string,
    @Req() req: ReqWithUserI,
    @Body() body: CommentPostDto,
  ) {
    return await this.postService.commentPost(id, req.user.id, body);
  }

  @Get('comments/:id')
  async getCommentPost(@Param('id', MongoIdPipe) id: string) {
    return await this.postService.getCommentsPost(id);
  }
}
