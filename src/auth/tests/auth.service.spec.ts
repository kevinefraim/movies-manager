import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { userStub } from './stubs/user.stub';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOne: jest.fn().mockResolvedValue(userStub()),
    createUser: jest.fn().mockResolvedValue(userStub()),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mockJwtToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a token and user data on successful login', async () => {
      jest.spyOn(argon2, 'verify').mockResolvedValue(true);

      const result = await service.signIn({
        username: 'testuser',
        password: 'password123',
      });

      expect(usersService.findOne).toHaveBeenCalledWith('testuser');
      expect(argon2.verify).toHaveBeenCalledWith(
        'hashedPassword',
        'password123',
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: userStub().id,
        username: userStub().username,
        role: userStub().role,
      });
      const { password, ...expected } = userStub();
      expect(result).toEqual({ user: expected, token: 'mockJwtToken' });
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      jest.spyOn(argon2, 'verify').mockResolvedValue(false);

      await expect(
        service.signIn({ username: 'testuser', password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      await expect(
        service.signIn({
          username: 'nonexistentuser',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signUp', () => {
    it('should create a new user and return a token and user data', async () => {
      jest.spyOn(argon2, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      const result = await service.signUp({
        name: 'New User',
        username: 'testuser',
        password: 'password123',
      });

      expect(usersService.findOne).toHaveBeenCalledWith('testuser');
      expect(argon2.hash).toHaveBeenCalledWith('password123');
      expect(usersService.createUser).toHaveBeenCalledWith({
        name: 'New User',
        username: 'testuser',
        password: 'hashedPassword',
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: userStub().id,
        username: 'testuser',
        role: userStub().role,
      });
      const { password, ...expected } = userStub();
      expect(result).toEqual({
        user: expected,
        token: 'mockJwtToken',
      });
    });

    it('should throw BadRequestException if username already exists', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(userStub());

      await expect(
        service.signUp({
          name: 'Existing User',
          username: 'testuser',
          password: 'password123',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
