import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { roles } from 'src/common/constants/roles.enum';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { ReqWithUserI } from 'src/common/models/token/reqWithToken.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const rolesData: roles[] = this.reflector.get(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!rolesData) {
      return true;
    }
    const { user }: ReqWithUserI = context.switchToHttp().getRequest();
    const isAuth = rolesData.some((r) => r === user.role);
    if (!isAuth) {
      throw new UnauthorizedException('Your role is wrong');
    }
    return true;
  }
}
