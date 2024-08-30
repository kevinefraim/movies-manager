import { IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieFromApiDto {
  @ApiProperty({
    description: 'Episode ID from the Star Wars API',
    example: 4,
  })
  @IsNotEmpty({ message: 'Episode ID field is required' })
  @IsInt({ message: 'Episode ID must be an integer' })
  episodeId: number;
}
