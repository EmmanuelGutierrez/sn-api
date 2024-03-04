import { Request } from 'express';
import { tokenI } from './token.model';

export interface ReqWithUserI extends Request {
  user: tokenI;
}
