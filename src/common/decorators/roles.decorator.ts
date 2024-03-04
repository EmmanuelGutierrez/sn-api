import { SetMetadata } from '@nestjs/common';
import { roles } from '../constants/roles.enum';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: roles[]) => SetMetadata(ROLES_KEY, roles);
