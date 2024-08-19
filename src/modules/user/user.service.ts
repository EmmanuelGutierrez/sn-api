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
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new ConflictException(
        this.i18nService.t('events.ERRORS.USER.NOT_FOUND'),
      );
    }
    return user;
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
