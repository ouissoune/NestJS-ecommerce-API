import { Repository } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { registerDto } from './dtos/register.dto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs'; // not `* as bcrypt`

import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserType } from 'src/utils/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  public async GetUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }
  public async Register(registerDto: registerDto) {
    const { username, password, email } = registerDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) throw new BadRequestException('user already exists');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let newUser = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });
    newUser = await this.userRepository.save(newUser);
    const { id, userType } = newUser;
    // @TODO: GENERATE JWT TOKEN
    const accessToken = await this.jwtService.signAsync({ id, userType });
    return { accessToken };
  }

  public async Login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new ForbiddenException('email or password invalid');
    if (!(await bcrypt.compare(password, user.password)))
      throw new ForbiddenException('email or password invalid');
    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      userType: user.userType,
    });
    return { accessToken };
  }

  public async GetCurrentUser(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        userType: true,
      },
    });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  public async GetAllUsers() {
    return await this.userRepository.find({
      select: {
        id: true,
        createdAt: true,
        email: true,
        username: true,
        userType: true,
      },
    });
  }

  public async UpdateUserById(id: number, newUser: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');
    if (newUser.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newUser.password, salt);
    }
    user.username = newUser.username ?? user.username;
    return await this.userRepository.save(user);
  }

  public async UpdateUserRoleById(id: number, newRole: UserType) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');
    user.userType = newRole;
    await this.userRepository.save(user);
    return {
      message: `user with id ${id} updated to role ${newRole}`,
    };
  }
}
