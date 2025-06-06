import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProductSearchDto {
  @ApiProperty({ description: 'Name to search by characters' })
  @IsString()
  name: string;
}
