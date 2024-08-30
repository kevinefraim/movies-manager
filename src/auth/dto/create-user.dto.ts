import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'Kevin Efraim',
  })
  @IsNotEmpty({ message: 'Name field is required' })
  name: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'kevinefraim',
  })
  @IsNotEmpty({ message: 'Username field is required' })
  username: string;

  @ApiProperty({
    description: 'The password of the user, must be at least 6 characters long',
    example: 'password123',
  })
  @IsNotEmpty({ message: 'Password field is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters or more' })
  password: string;
}
