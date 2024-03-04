import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneWithPasswordByEmail(email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    }
    return null;
  }

  async register(data: CreateUserDto) {
    const user = await this.userService.create(data);

    const token = this.generateJWT(user);
    return { token };
  }

  generateJWT(user: User) {
    const payload = { role: user.role, email: user.email, id: user.id };
    return this.jwtService.sign(payload);
  }
}
