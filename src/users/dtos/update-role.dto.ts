import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserType } from 'src/utils/enums';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsEnum(UserType, {
    message: 'Role must be one of the following: NORMAL_USER, ADMIN',
  })
  role: UserType;
}
