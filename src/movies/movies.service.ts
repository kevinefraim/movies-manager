import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { MoviesApi, MoviesApiResponse } from './types/movies.types';
import { ConfigService } from '@nestjs/config';
import { FILMS_ENDPOINT } from './constants';
import { PrismaService } from '../prisma/prisma.service';
import { Movie, PrismaClient } from '@prisma/client';
import { CreateMovieFromApiDto } from './dto/create-movie-from-api.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    private readonly httpService: HttpService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}
  private movieEntity: PrismaClient['movie'] = this.prisma.movie;
  private apiUrl = this.config.get('STAR_WARS_API_URL');

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

  //Create a movie with the episode id from the api
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

    //Always have to find all because the api does not retrieve the id so the user will never know how to find it
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
