import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { TokenReturnDto } from './dto/token-return.dto';
import { UseGuards } from '@nestjs/common';
import { LoginInputDto } from './dto/login-input.dto';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { User } from '../user/entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => TokenReturnDto)
  @UseGuards(GqlAuthGuard)
  login(
    @Args('loginUserInput') loginUserInput: LoginInputDto,
    @Context() context,
  ) {
    const user = context.user as User;
    return { token: this.authService.generateJWT(user) };
  }

  @Mutation(() => TokenReturnDto, { name: 'register' })
  register(@Args('data') data: CreateUserDto) {
    return this.authService.register(data);
  }
}
