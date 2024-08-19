import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtExpressAuthGuard } from '../auth/guards/express-auth.guard';
import { ReqWithUserI } from 'src/common/models/token/reqWithToken.model';

UseGuards(JwtExpressAuthGuard);
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseInterceptors(FilesInterceptor('files'))
  register(
    @Body() body: CreatePostDto,
    @Req() req: ReqWithUserI,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /.(jpe?g|png|svg|webp|bmp)$/i,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    files?: Express.Multer.File[],
  ) {
    return this.postService.createWithFiles(body, req.user.id, files);
  }
}
