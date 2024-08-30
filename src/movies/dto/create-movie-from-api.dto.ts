import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateMovieFromApiDto {
  @IsNotEmpty({ message: 'Episode ID field is required' })
  @IsInt({ message: 'Episode ID must be an integer' })
  episodeId: number;
}
