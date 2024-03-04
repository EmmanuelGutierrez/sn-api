import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  body: string;

  @IsNotEmpty()
  @IsMongoId()
  post: string;
}
