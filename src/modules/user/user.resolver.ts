import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { tokenInfoI } from 'src/common/models/token/token.model';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'me' })
  findMe(@CurrentUser() tokenData: tokenInfoI) {
    return this.userService.getOneById(tokenData.id);
  }

  @Mutation(() => Boolean, { name: 'followUser' })
  followUser(
    @Args('userToFollowId') userToFollowId: string,
    @CurrentUser() tokenData: tokenInfoI,
  ) {
    return this.userService.followUser(tokenData.id, userToFollowId);
  }
}
