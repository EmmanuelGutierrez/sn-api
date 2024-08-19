import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Readable } from 'stream';

export class File {
  @IsString()
  @IsOptional()
  encoding: string;

  @IsString()
  @IsOptional()
  mimetype: string;

  @IsString()
  @IsOptional()
  size: number;

  @Type(() => Readable)
  @IsOptional()
  stream: Readable;

  @IsString()
  @IsOptional()
  destination: string;

  @IsString()
  @IsOptional()
  filename: string;

  @IsString()
  @IsOptional()
  path: string;

  @Type(() => Buffer)
  @IsOptional()
  buffer: Buffer;
}
