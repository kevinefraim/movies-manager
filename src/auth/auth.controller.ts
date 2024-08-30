import { Body, Controller, Get, Post, Req, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from 'src/users/dto/signin-dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Public } from './decorators/public.decorator';
import { Role } from './decorators/role.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Public()
  @Post('login')
  signIn(@Body() dto: SigninDto) {
    return this.authService.signIn(dto);
  }

  // @Public()
  @Post('register')
  signUp(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @Role('ADMIN')
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req['user'];
  }
}
