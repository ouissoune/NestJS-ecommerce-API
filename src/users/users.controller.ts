import { UsersService } from 'src/users/users.service';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { registerDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { JWTPayloadType } from 'src/utils/types';
import { Roles } from './decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { AuthRolesGuard } from './guards/auth-role.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Controller('api/users')
export class UsersController {
  /**
   *
   */
  constructor(private usersService: UsersService) {}

  @Post()
  public async Register(@Body() registerDto: registerDto) {
    return await this.usersService.Register(registerDto);
  }

  @Post('auth/login')
  public async Login(@Body() loginDto: LoginDto) {
    return await this.usersService.Login(loginDto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  public GetCurrentUser(@CurrentUser() user: JWTPayloadType) {
    return this.usersService.GetCurrentUser(user.id);
  }

  @Patch()
  @UseGuards(AuthGuard)
  public async UpdateUser(
    @CurrentUser() payload: JWTPayloadType,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { id } = payload;
    return await this.usersService.UpdateUserById(id, updateUserDto);
  }

  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async GetAllUsers() {
    return await this.usersService.GetAllUsers();
  }

  @Patch(':id')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  public async UpdateUserRoleById(
    @CurrentUser() payload: JWTPayloadType,
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return await this.usersService.UpdateUserRoleById(id, updateRoleDto.role);
  }
}
