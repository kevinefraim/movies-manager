import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Movie, PrismaClient } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { MoviesApi, MoviesApiResponse } from 'movies/types/movies.types';
import { FILMS_ENDPOINT } from 'movies/movies.constants';
import { CreateMovieFromApiDto } from 'movies/dto/create-movie-from-api.dto';
import { CreateMovieDto } from 'movies/dto/create-movie.dto';
import { UpdateMovieDto } from 'movies/dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    private readonly httpService: HttpService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}
  private movieEntity: PrismaClient['movie'] = this.prisma.movie;
  private apiUrl = this.config.get('STAR_WARS_API_URL');

  async syncMoviesFromApi() {
    const apiMovies = await this.findAllFromApi();

    const promises = apiMovies.map(async apiMovie => {
      const existingMovie = await this.prisma.movie.findUnique({
        where: { episodeId: apiMovie.episode_id },
      });

      if (!existingMovie) {
        await this.prisma.movie.create({
          data: this.formatMovie(apiMovie),
        });
      }
    });

    await Promise.all(promises);

    return { message: 'Movies synchronized successfully' };
  }

  async findAllFromApi(): Promise<MoviesApi[]> {
    try {
      const response: AxiosResponse<MoviesApiResponse> = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/${FILMS_ENDPOINT}`),
      );
      return response.data.results;
    } catch (error) {
      throw new BadRequestException('Failed to reach API server');
    }
  }

  private formatMovie(
    apiMovie: MoviesApi,
  ): Omit<Movie, 'id' | 'createdAt' | 'updatedAt'> {
    const {
      director,
      producer,
      episode_id,
      opening_crawl,
      release_date,
      title,
    } = apiMovie;

    return {
      title,
      director,
      producer,
      openingCrawl: opening_crawl,
      episodeId: episode_id,
      releaseDate: new Date(release_date),
    };
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieEntity.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return movie;
  }

  async findAll(): Promise<Movie[]> {
    return this.movieEntity.findMany();
  }

  async createFromApi({ episodeId }: CreateMovieFromApiDto) {
    const dbMovie = await this.movieEntity.findUnique({ where: { episodeId } });
    if (dbMovie) {
      throw new BadRequestException('There is a movie with this episode');
    }

    const apiMovies = await this.findAllFromApi();
    const apiMovie = apiMovies.find(movie => movie.episode_id === episodeId);

    if (!apiMovie) {
      throw new NotFoundException('Episode does not exist');
    }

    return this.movieEntity.create({ data: this.formatMovie(apiMovie) });
  }

  async createNewMovie(dto: CreateMovieDto) {
    const dbMovie = await this.movieEntity.findUnique({
      where: { episodeId: dto.episodeId },
    });

    if (dbMovie) {
      throw new BadRequestException('There is a movie with this episode');
    }

    const apiMovies = await this.findAllFromApi();
    const apiMovie = apiMovies.some(
      movie => movie.episode_id === dto.episodeId,
    );

    if (apiMovie) {
      throw new BadRequestException('There is a movie with this episode');
    }

    return this.movieEntity.create({
      data: { ...dto, releaseDate: new Date(dto.releaseDate) },
    });
  }

  async update(dto: UpdateMovieDto, id: number) {
    const movie = await this.movieEntity.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    if (dto.episodeId) {
      const dbMovie = await this.movieEntity.findUnique({
        where: { episodeId: dto.episodeId },
      });

      if (dbMovie) {
        throw new BadRequestException('There is a movie with this episode');
      }

      const apiMovies = await this.findAllFromApi();
      const apiMovie = apiMovies.some(
        movie => movie.episode_id === dto.episodeId,
      );

      if (apiMovie) {
        throw new BadRequestException('There is a movie with this episode');
      }
    }

    return this.movieEntity.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.releaseDate && { releaseDate: new Date(dto.releaseDate) }),
      },
    });
  }

  async delete(id: number) {
    const movie = await this.movieEntity.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return this.movieEntity.delete({ where: { id } });
  }
}
