import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export function getAuthHeader(context: ExecutionContext): string {
  return context.getArgs()[2]?.req?.headers?.authorization;
}

/* export const User = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const authService = new AuthService();

    const jwt = getAuthHeader(context);
    const decoded: any = jwt_decode(jwt);
    if (decoded) {
      return authService.findUser(data, decoded);
    }
  },
); */

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();
    const user = request.req.user ?? request.extra.user;
    return user;
  },
);
