import { ApiProperty } from '@nestjs/swagger';

export class MovieEntity {
  @ApiProperty({ example: 'A New Hope' })
  title: string;

  @ApiProperty({ example: 'George Lucas' })
  director: string;

  @ApiProperty({ example: 'Gary Kurtz, Rick McCallum' })
  producer: string;

  @ApiProperty({ example: '1977-05-25' })
  releaseDate: string;

  @ApiProperty({ example: 'It is a period of civil war...' })
  openingCrawl: string;

  @ApiProperty({ example: 4 })
  episodeId: number;
}
