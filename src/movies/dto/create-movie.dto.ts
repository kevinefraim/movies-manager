import { IsString, IsDateString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    description: 'Title of the movie',
    example: 'A New Hope',
  })
  @IsNotEmpty({ message: 'Title field is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({
    description: 'Director of the movie',
    example: 'George Lucas',
  })
  @IsNotEmpty({ message: 'Director field is required' })
  @IsString({ message: 'Director must be a string' })
  director: string;

  @ApiProperty({
    description: 'Producer of the movie',
    example: 'Gary Kurtz, Rick McCallum',
  })
  @IsNotEmpty({ message: 'Producer field is required' })
  @IsString({ message: 'Producer must be a string' })
  producer: string;

  @ApiProperty({
    description: 'Release date of the movie',
    example: '1977-05-25',
  })
  @IsNotEmpty({ message: 'Release Date field is required' })
  @IsDateString({}, { message: 'Release Date must be a valid date string' })
  releaseDate: string;

  @ApiProperty({
    description: 'Opening crawl text of the movie',
    example: 'It is a period of civil war...',
  })
  @IsNotEmpty({ message: 'Opening Crawl is required' })
  @IsString({ message: 'Opening Crawl must be a string' })
  openingCrawl: string;

  @ApiProperty({
    description: 'Episode ID of the movie',
    example: 4,
  })
  @IsNotEmpty({ message: 'Episode ID is required' })
  @IsNumber({}, { message: 'Episode ID must be a number' })
  episodeId: number;
}
