import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  private userEntity: PrismaClient['user'] = this.prisma.user;

  async findOne(username: string) {
    return this.userEntity.findUnique({ where: { username } });
  }

  async createUser(dto: CreateUserDto) {
    return this.userEntity.create({ data: dto });
  }
}
