import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetProductsQueryDto {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  @ApiProperty({
    required: false,
    description: 'Whether the product is featured',
  })
  featured?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false, description: 'Number of products per page' })
  size?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ required: false, description: 'Minimum price filter' })
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ required: false, description: 'Maximum price filter' })
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiProperty({
    required: false,
    description: 'Limit the total number of results',
  })
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false, description: 'Page number for pagination' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiProperty({
    required: false,
    description: 'Category ID to filter products',
  })
  categoryId?: number;

  @ApiProperty({ required: false, description: 'Name to search by characters' })
  @IsString()
  @IsOptional()
  name?: string;
}
