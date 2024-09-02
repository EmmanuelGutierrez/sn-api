import { Context } from 'graphql-ws';
import { tokenInfoI } from './token/token.model';

export interface contextGraphqlWs extends Context {
  extra: {
    user: tokenInfoI;
  };
}
