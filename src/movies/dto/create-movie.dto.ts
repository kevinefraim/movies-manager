import { IsString, IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty({ message: 'Title field is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'Director field is required' })
  @IsString({ message: 'Director must be a string' })
  director: string;

  @IsNotEmpty({ message: 'Producer field is required' })
  @IsString({ message: 'Producer must be a string' })
  producer: string;

  @IsNotEmpty({ message: 'Release Date field is required' })
  @IsDateString({}, { message: 'Release Date must be a valid date string' })
  releaseDate: string;

  @IsNotEmpty({ message: 'Opening Crawl is required' })
  @IsString({ message: 'Opening Crawl must be a string' })
  openingCrawl: string;

  @IsNotEmpty({ message: 'Episode ID is required' })
  @IsNumber({}, { message: 'Episode ID must be a number' })
  episodeId: number;
}
