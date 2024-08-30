import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SigninDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'kevinefraim',
  })
  @IsNotEmpty({ message: 'Username field is required' })
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsNotEmpty({ message: 'Password field is required' })
  password: string;
}
