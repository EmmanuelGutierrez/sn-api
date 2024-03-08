import { Request } from 'express';
import { tokenInfoI } from './token.model';

export interface CtxWithUserI {
  req: ReqWithUserI;
}

export interface ReqWithUserI extends Request {
  user: tokenInfoI;
}
