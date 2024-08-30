import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SigninDto } from 'src/users/dto/signin-dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from '@prisma/client';

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
    if (!foundUser) throw new UnauthorizedException();

    const isValidPassword = await argon.verify(
      foundUser.password,
      dto.password,
    );
    if (!isValidPassword) throw new UnauthorizedException();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = foundUser;
    const token = await this.generateJwt(user);

    return { user, token };
  }

  async signUp(dto: CreateUserDto) {
    const checkUser = await this.usersService.findOne(dto.username);
    if (checkUser) throw new BadRequestException('User already exists');

    const hashedPassword = await argon.hash(dto.password);

    const newUser = await this.usersService.createUser({
      ...dto,
      password: hashedPassword,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = newUser;
    const token = await this.generateJwt(user);

    return { user, token };
  }
}
