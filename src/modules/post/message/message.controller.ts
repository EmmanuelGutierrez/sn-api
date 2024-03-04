import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { MongoIdPipe } from 'src/common/pipes/mongo-id/mongo-id.pipe';
import { ReqWithUserI } from 'src/common/models/token/reqWithToken.model';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('create')
  create(@Body() createMessageDto: CreateMessageDto, @Req() req: ReqWithUserI) {
    return this.messageService.create(createMessageDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get('get-one/:id')
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.messageService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @Req() req: ReqWithUserI,
  ) {
    return this.messageService.update(id, updateMessageDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
