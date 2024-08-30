import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { HttpModule } from '@nestjs/axios';
import { MoviesCronService } from 'movies/movies.cron.service';

@Module({
  imports: [HttpModule],
  controllers: [MoviesController],
  providers: [MoviesService, MoviesCronService],
})
export class MoviesModule {}
