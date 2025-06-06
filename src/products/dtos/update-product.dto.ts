import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public name?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  public quantity?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  public price?: number;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  @IsOptional()
  public featured?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public description?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  public categoryId?: number;
}
