import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from 'auth/dto/create-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { SigninDto } from 'auth/dto/signin-dto';
import { AuthService } from 'auth/auth.service';
import { Public } from 'auth/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  signIn(@Body() dto: SigninDto) {
    return this.authService.signIn(dto);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  signUp(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }
}
