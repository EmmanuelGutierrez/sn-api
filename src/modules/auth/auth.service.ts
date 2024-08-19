import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/common/models/i18n.generated';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneWithPasswordByEmail(email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    } else {
      throw new NotFoundException(
        this.i18nService.t('events.ERRORS.USER.NOT_FOUND'),
      );
    }
  }

  async register(data: CreateUserDto, file?: Express.Multer.File) {
    const user = await this.userService.create(data, file);

    const token = this.generateJWT(user);
    return { token };
  }

  generateJWT(user: User) {
    const payload = { role: user.role, email: user.email, id: user.id };
    return this.jwtService.sign(payload);
  }
}
