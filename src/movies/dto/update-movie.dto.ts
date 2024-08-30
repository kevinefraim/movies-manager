import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @ApiPropertyOptional({
    description: 'Title of the movie',
    example: 'A New Hope',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Director of the movie',
    example: 'George Lucas',
  })
  director?: string;

  @ApiPropertyOptional({
    description: 'Producer of the movie',
    example: 'Gary Kurtz, Rick McCallum',
  })
  producer?: string;

  @ApiPropertyOptional({
    description: 'Release date of the movie',
    example: '1977-05-25',
  })
  releaseDate?: string;

  @ApiPropertyOptional({
    description: 'Opening crawl text of the movie',
    example: 'It is a period of civil war...',
  })
  openingCrawl?: string;

  @ApiPropertyOptional({
    description: 'Episode ID of the movie',
    example: 4,
  })
  episodeId?: number;
}
