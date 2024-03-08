import { roles } from '../../constants/roles.enum';

export interface tokenInfoI extends jwtData {
  role: roles;
  email: string;
  id: string;
}

export interface jwtData {
  iat: number;
  exp: number;
}
