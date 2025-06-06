import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, description: 'name of the product' })
  public name: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    required: true,
    description: 'initial quantity that exists in the stock',
  })
  public quantity: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({ required: true, description: 'price of the product' })
  public price: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ required: true, description: 'is the product featured' })
  public featured: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, description: 'description of the product' })
  public description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'ID of the category that a product belongs to',
  })
  public categoryId: number;
}
