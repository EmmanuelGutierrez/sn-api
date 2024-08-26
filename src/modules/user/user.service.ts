import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './entities/user.entity';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/common/models/i18n.generated';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileService } from '../file/file.service';
import { File } from '../file/entities/file.entity';
import { FollowUserDto } from './dto/follow-user.dto';
import { toTimestamp } from 'src/common/utils/ToTimestamp';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly fileService: FileService,
  ) {}

  async create(
    { password, ...data }: CreateUserDto,
    file?: Express.Multer.File,
  ) {
    const existUser = await this.userModel.exists({ email: data.email });
    if (existUser) {
      throw new ConflictException(
        this.i18nService.t('events.ERRORS.USER.CONFLICT_EMAIL'),
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user: User = await this.userModel.create({
      ...data,
      password: hashPassword,
      //profile_image: fileName,
    });
    if (file) {
      const profile_image = await this.fileService.create(
        file,
        user._id,
        `users/profile_images/${user._id}`,
      );
      user.profile_image = profile_image._id as Types.ObjectId;
    }
    return user.save();
  }

  async getOneById(userId: string) {
    const user = await this.userModel.findById(userId).populate([
      {
        path: 'following.user',
        model: User.name,
      },
      {
        path: 'followers.user',
        model: User.name,
      },
    ]);
    if (!user) {
      throw new ConflictException(
        this.i18nService.t('events.ERRORS.USER.NOT_FOUND'),
      );
    }
    console.log(user);
    return user;
  }

  async followUser(userId: string, userToFollowId: string) {
    console.log(userId, userToFollowId);
    // await this.getOneById(userId);
    // const user = await this.userModel.find({
    //   'following.userId': { $nin: [userToFollowId] },
    //   _id: userId,
    // });
    // console.log(user);
    // await this.getOneById(userToFollowId);

    const user = await this.getOneById(userId);
    const userToFollow = await this.getOneById(userToFollowId);

    const followingIndex = user.following.findIndex(
      (f) => f.user._id === userToFollowId,
    );
    const follwerIndex = userToFollow.followers.findIndex(
      (f) => f.user._id === userId,
    );
    if (followingIndex !== -1 && follwerIndex !== -1) {
      user.following.splice(followingIndex, 1);
      userToFollow.followers.splice(follwerIndex, 1);
      await user.save();
      await userToFollow.save();
      return true;
    } else {
      const dateNow = toTimestamp(new Date());

      const res = await this.userModel.bulkWrite([
        {
          updateOne: {
            filter: { _id: userToFollowId },
            update: {
              $push: {
                followers: {
                  user: user,
                  followDate: dateNow,
                },
              },
            },
          },
        },
        {
          updateOne: {
            filter: { _id: userId },
            update: {
              $push: {
                following: {
                  user: userToFollow,
                  followDate: dateNow,
                },
              },
            },
          },
        },
      ]);
      console.log(res);
    }

    return true;
  }

  /* async uploadProfileImage(file: Express.Multer.File) {
    // const user = await this.getOneById(userId);
    const res = await this.cloudinaryService.uploadFile(file);
    return res;
  } */

  async findAll() {
    const users = await this.userModel
      .find()
      .populate([
        {
          path: 'profile_image',
          model: File.name,
        },
      ])
      .exec();
    return users;
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(
        this.i18nService.t('events.ERRORS.USER.NOT_FOUND'),
      );
    }
    return user;
  }

  async findOneWithPasswordByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new NotFoundException(
        this.i18nService.t('events.ERRORS.USER.NOT_FOUND'),
      );
    }
    return user;
  }
}
