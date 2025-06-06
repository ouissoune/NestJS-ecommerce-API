import { IsEnum } from 'class-validator';
import { Period } from 'src/utils/enums';

export class GetStatsDto {
  @IsEnum(Period, {
    message: `Period must be one of the following: ${Object.values(Period).join(', ')}`,
  })
  period: Period;
}
