import { SetMetadata } from '@nestjs/common';
import { Role as RoleEntity } from '@prisma/client';

export const ROLE_KEY = 'roles';
export const Role = (role: RoleEntity) => SetMetadata(ROLE_KEY, role);
