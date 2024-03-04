import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FilterDto } from './dto/filter.dto';
import { User } from '../user/entities/user.entity';
import { CommentPostDto } from './dto/comment-post.dto';
import { MessageService } from './message/message.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<Post>,
    private messageService: MessageService,
  ) {}
  async create(createPostDto: CreatePostDto, userId: string) {
    const post = await this.postModel.create({
      ...createPostDto,
      user: userId,
    });
    return post;
  }

  async findAll(params: FilterDto) {
    const { limit = 10, page = 1 } = params;
    const posts = await this.postModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.postModel.countDocuments();
    return { page, inThisPage: posts.length, total, data: posts };
  }

  async me(params: FilterDto, userId: string) {
    const { limit = 10, page = 1, tags } = params;
    const filters: FilterQuery<Post> = {};
    filters.user = userId;
    if (tags) {
      /* filters.$or = tags.map((t) => {
        return {
          tags: t,
        };
      }); */
      filters.tags = { $elemMatch: { $in: tags } };
    }
    const posts = await this.postModel
      .find(filters)
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await this.postModel.countDocuments(filters);
    return { page, inThisPage: posts.length, total, data: posts };
  }

  async findOne(id: string) {
    const post = await this.postModel.findById(id).populate([
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
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string) {
    const updatedPlanificatedMovement = await this.postModel
      .findOneAndUpdate(
        { $and: [{ user: userId }, { _id: id }] },
        { $set: updatePostDto },
        { new: true },
      )
      .exec();

    if (!updatedPlanificatedMovement) {
      throw new NotFoundException(`Movement with id ${id} not found`);
    }
    return updatedPlanificatedMovement;
  }

  async updateReactions(id: string, userId: string) {
    const post = await this.findOne(id);
    const existReaction = post.reactions.some((r) => r.id === userId);

    if (existReaction) {
      const res = await this.postModel.findByIdAndUpdate(id, {
        $pull: { reactions: userId },
      });
      return res;
    } else {
      const res = await this.postModel.findByIdAndUpdate(id, {
        $push: { reactions: userId },
      });
      return res;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  async commentPost(id: string, userId: string, data: CommentPostDto) {
    const post = await this.findOne(id);

    const res = await this.messageService.create(
      { body: data.body, post: post.id },
      userId,
    );

    return res;
  }

  async getCommentsPost(id: string) {
    const post = await this.findOne(id);
    const comments = await this.messageService.findAllPost(post.id);
    return comments;
  }
}
