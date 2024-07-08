import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from '../../common/config/config';
import { tokenInfoI } from 'src/common/models/token/token.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>, //private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.api.jwtSecret,
      ignoreExpiration: true,
    });
  }

  validate(payload: tokenInfoI) {
    return payload;
  }
}
