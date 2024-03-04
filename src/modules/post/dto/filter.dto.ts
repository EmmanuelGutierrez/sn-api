import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  page: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
