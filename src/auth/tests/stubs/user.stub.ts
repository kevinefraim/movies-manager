import { Role, User } from '@prisma/client';

export const userStub = (): User => {
  return {
    id: 1,
    username: 'testuser',
    password: 'hashedPassword',
    name: 'Test User',
    role: Role.REGULAR,
    createdAt: new Date('2021-01-01'),
    updatedAt: new Date('2021-01-01'),
  };
};
