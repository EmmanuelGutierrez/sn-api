import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/common/config/config';
import { ConfigType } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { AuthResolver } from './auth.resolver';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.api.jwtSecret,
          signOptions: {
            expiresIn: '10d',
          },
        };
      },
    }),
  ],
})
export class AuthModule {}
