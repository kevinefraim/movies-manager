import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name field is required' })
  name: string;

  @IsNotEmpty({ message: 'Username field is required' })
  username: string;

  @IsNotEmpty({ message: 'Password field is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters or more' })
  password: string;
}
