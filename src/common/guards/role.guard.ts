import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLE_KEY } from 'common/decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<Role>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole) return true;

    const { user } = context.switchToHttp().getRequest();

    const hasRole = requiredRole === user.role;

    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have the required role to perform this action.',
      );
    }

    return true;
  }
}
