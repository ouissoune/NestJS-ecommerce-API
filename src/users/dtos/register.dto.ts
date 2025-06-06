import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class registerDto {
  @IsString()
  @IsOptional()
  @Length(2, 150)
  username: string;
  @IsEmail()
  @IsString()
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
