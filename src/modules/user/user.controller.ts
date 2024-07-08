import {
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /* @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);  
  } */

  @Get('get-all')
  findAll() {
    return this.userService.findAll();
  }

  @Post('get-all')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /.(jpe?g|png|svg|webp|bmp)$/i,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.findAll();
  }

  /*  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  } */
}
