import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './entities/message.entity';
import { Model } from 'mongoose';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
  ) {}
  async create(createMessageDto: CreateMessageDto, userId: string) {
    const message = await this.messageModel.create({
      ...createMessageDto,
      user: userId,
    });
    return message;
  }

  findAll() {
    return `This action returns all message`;
  }

  async findAllPost(id: string) {
    const messages = await this.messageModel.find({ post: id });
    return messages;
  }

  async findOne(id: string) {
    const message = await this.messageModel.findById(id).populate([
      {
        path: 'reactions',
        model: User.name,
        select: ['id', 'first_name', 'last_name'],
      },
      {
        path: 'user',
        model: User.name,
        select: ['id', 'first_name', 'last_name'],
      },
    ]);
    if (!message) {
      throw new NotFoundException('message not found');
    }
    return message;
  }

  async update(id: string, updatePostDto: UpdateMessageDto, userId: string) {
    const messageUpd = await this.messageModel
      .findOneAndUpdate(
        { $and: [{ user: userId }, { _id: id }] },
        { $set: updatePostDto },
        { new: true },
      )
      .exec();

    if (!messageUpd) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }
    return messageUpd;
  }

  async updateReactions(id: string, userId: string) {
    const message = await this.findOne(id);
    const existReaction = message.reactions.some((r) => r.id === userId);

    if (existReaction) {
      const res = await this.messageModel.findByIdAndUpdate(id, {
        $pull: { reactions: userId },
      });
      return res;
    } else {
      const res = await this.messageModel.findByIdAndUpdate(id, {
        $push: { reactions: userId },
      });
      return res;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
