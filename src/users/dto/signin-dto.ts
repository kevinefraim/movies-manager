import { IsNotEmpty } from 'class-validator';

export class SigninDto {
  @IsNotEmpty({ message: 'Username field is required' })
  username: string;

  @IsNotEmpty({ message: 'Password field is required' })
  password: string;
}
