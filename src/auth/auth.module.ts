import { Module } from '@nestjs/common';
import { AuthController } from 'auth/auth.controller';
import { AuthService } from 'auth/auth.service';
import { UsersModule } from 'users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'auth/constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'auth/guards/auth.guard';
import { RoleGuard } from 'auth/guards/role.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
