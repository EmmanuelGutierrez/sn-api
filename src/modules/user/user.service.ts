import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/common/models/i18n.generated';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}

  async create({ password, ...data }: CreateUserDto) {
    const existUser = await this.userModel.exists({ email: data.email });
    if (existUser) {
      throw new ConflictException(
        this.i18nService.t('events.ERRORS.USER.CONFLICT_EMAIL'),
      );
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      ...data,
      password: hashPassword,
    });
    return user;
  }

  async findAll() {
    const users = await this.userModel.find();
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
