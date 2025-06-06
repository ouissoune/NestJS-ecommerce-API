import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  username: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: string;
}
