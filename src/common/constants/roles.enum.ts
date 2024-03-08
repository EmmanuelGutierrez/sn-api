import { registerEnumType } from '@nestjs/graphql';

export enum roles {
  ADMIN = 'admin',
  USER = 'user',
}

registerEnumType(roles, {
  name: 'roles',
  description: 'Indicates the user role',
});
