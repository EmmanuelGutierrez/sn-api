import { Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }
}
