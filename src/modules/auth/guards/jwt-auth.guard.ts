import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { IS_SUBSCRIPTION } from 'src/common/decorators/subscription.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements IAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    return request;
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    const isSubscription = this.reflector.get(
      IS_SUBSCRIPTION,
      context.getHandler(),
    );
    // console.log('1', context.getArgs());

    if (isPublic || isSubscription) return true;
    await super.canActivate(context);
    const ctx = GqlExecutionContext.create(context);

    const request = ctx.getContext().req;
    const { user }: Request = request;
    if (!user) throw new UnauthorizedException('no auth');

    return user ? true : false;
  }
}
