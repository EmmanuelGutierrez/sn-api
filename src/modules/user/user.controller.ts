import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

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

  /* @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @Body() body: CreateUserDto,
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
    return this.userService.uploadProfileImage(file);
  } */

  /*  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  } */
}
