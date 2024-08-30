import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { userStub } from './stubs/user.stub';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    signIn: jest
      .fn()
      .mockResolvedValue({ user: userStub(), token: 'mockJwtToken' }),
    signUp: jest
      .fn()
      .mockResolvedValue({ user: userStub(), token: 'mockJwtToken' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a token and user data on successful login', async () => {
      const result = await controller.signIn({
        username: 'testuser',
        password: 'password123',
      });

      expect(service.signIn).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
      expect(result).toEqual({ user: userStub(), token: 'mockJwtToken' });
    });
  });

  describe('signUp', () => {
    it('should create a new user and return a token and user data', async () => {
      const result = await controller.signUp({
        name: 'New User',
        username: 'newuser',
        password: 'password123',
      });

      expect(service.signUp).toHaveBeenCalledWith({
        name: 'New User',
        username: 'newuser',
        password: 'password123',
      });
      expect(result).toEqual({ user: userStub(), token: 'mockJwtToken' });
    });
  });
});
