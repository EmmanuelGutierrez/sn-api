import { registerEnumType } from '@nestjs/graphql';

export enum postTypes {
  POST = 'post',
  COMMENT = 'comment',
}

registerEnumType(postTypes, {
  name: 'postTypes',
  description: 'post type',
});
