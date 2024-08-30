import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from '@prisma/client';
import { SigninDto } from 'src/auth/dto/signin-dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async generateJwt(user: Omit<User, 'password'>) {
    const payload = { sub: user.id, username: user.username, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return token;
  }

  async signIn(dto: SigninDto) {
    const foundUser = await this.usersService.findOne(dto.username);
    if (!foundUser)
      throw new UnauthorizedException('Invalid username or password.');

    const isValidPassword = await argon.verify(
      foundUser.password,
      dto.password,
    );
    if (!isValidPassword)
      throw new UnauthorizedException('Invalid username or password.');

    const { password, ...user } = foundUser;
    const token = await this.generateJwt(user);

    return { user, token };
  }

  async signUp(dto: CreateUserDto) {
    const checkUser = await this.usersService.findOne(dto.username);
    if (checkUser) throw new BadRequestException('User already exists.');

    const hashedPassword = await argon.hash(dto.password);

    const newUser = await this.usersService.createUser({
      ...dto,
      password: hashedPassword,
    });

    const { password, ...user } = newUser;
    const token = await this.generateJwt(user);

    return { user, token };
  }
}
