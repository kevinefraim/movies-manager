import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MoviesService } from 'src/movies/movies.service';

@Injectable()
export class MoviesCronService {
  constructor(private readonly moviesService: MoviesService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCron() {
    this.moviesService.syncMoviesFromApi();
  }
}
