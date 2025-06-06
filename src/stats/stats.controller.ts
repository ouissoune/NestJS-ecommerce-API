import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetStatsDto } from './dtos/get-stats.dto';
import { StatsService } from './stats.service';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';

@Controller('api/stats')
export class StatsController {
  constructor(private statsService: StatsService) {}
  @Get()
  @Roles(UserType.ADMIN) // Only allow ADMIN users to access stats
  @UseGuards(AuthRolesGuard)
  public async getStats(@Query() query: GetStatsDto) {
    return this.statsService.getStats(query);
  }
}
