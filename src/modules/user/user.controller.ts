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

  /*  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  } */
}
