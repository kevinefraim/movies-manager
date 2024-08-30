import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { Movie } from '@prisma/client';
import { MoviesApi, MoviesApiResponse } from 'movies/types/movies.types';
import { FILMS_ENDPOINT } from 'movies/constants/movies.constants';
import { CreateMovieFromApiDto } from 'movies/dto/create-movie-from-api.dto';
import { CreateMovieDto } from 'movies/dto/create-movie.dto';
import { UpdateMovieDto } from 'movies/dto/update-movie.dto';

@Injectable()
export class MoviesService {
  private readonly movieEntity = this.prisma.movie;
  private readonly apiUrl = this.config.get<string>('STAR_WARS_API_URL');

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  // Synchronize movies from the Star Wars API
  async syncMoviesFromApi() {
    const apiMovies = await this.findAllFromApi();

    await Promise.all(
      apiMovies.map(async apiMovie => {
        const existingMovie = await this.movieEntity.findUnique({
          where: { episodeId: apiMovie.episode_id },
        });

        if (!existingMovie) {
          await this.movieEntity.create({
            data: this.formatMovie(apiMovie),
          });
        }
      }),
    );

    return { message: 'Movies synchronized successfully' };
  }

  // Fetch all movies from the Star Wars API
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

  // Format the movie data from the API to match the database schema
  private formatMovie(
    apiMovie: MoviesApi,
  ): Omit<Movie, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      title: apiMovie.title,
      director: apiMovie.director,
      producer: apiMovie.producer,
      openingCrawl: apiMovie.opening_crawl,
      episodeId: apiMovie.episode_id,
      releaseDate: new Date(apiMovie.release_date),
    };
  }

  // Find a movie by its ID
  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieEntity.findUnique({ where: { id } });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  // Fetch all movies from the database
  async findAll(): Promise<Movie[]> {
    return this.movieEntity.findMany();
  }

  // Create a new movie using data from the Star Wars API
  async createFromApi({ episodeId }: CreateMovieFromApiDto) {
    await this.ensureMovieDoesNotExist(episodeId);

    const apiMovies = await this.findAllFromApi();
    const apiMovie = apiMovies.find(movie => movie.episode_id === episodeId);

    if (!apiMovie) {
      throw new NotFoundException('Episode does not exist');
    }

    return this.movieEntity.create({ data: this.formatMovie(apiMovie) });
  }

  // Create a new movie manually
  async createNewMovie(dto: CreateMovieDto) {
    await this.ensureMovieDoesNotExist(dto.episodeId);

    const apiMovies = await this.findAllFromApi();
    const isDuplicate = apiMovies.some(
      movie => movie.episode_id === dto.episodeId,
    );

    if (isDuplicate) {
      throw new BadRequestException('There is a movie with this episode');
    }

    return this.movieEntity.create({
      data: { ...dto, releaseDate: new Date(dto.releaseDate) },
    });
  }

  // Update an existing movie
  async update(dto: UpdateMovieDto, id: number) {
    const movie = await this.findOne(id);

    if (dto.episodeId) {
      await this.ensureMovieDoesNotExist(dto.episodeId);

      const apiMovies = await this.findAllFromApi();
      const isDuplicate = apiMovies.some(
        movie => movie.episode_id === dto.episodeId,
      );

      if (isDuplicate) {
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

  // Delete a movie by ID
  async delete(id: number) {
    const movie = await this.findOne(id);
    return this.movieEntity.delete({ where: { id: movie.id } });
  }

  // Ensure a movie with the given episode ID does not already exist
  private async ensureMovieDoesNotExist(episodeId: number) {
    const existingMovie = await this.movieEntity.findUnique({
      where: { episodeId },
    });
    if (existingMovie) {
      throw new BadRequestException('There is a movie with this episode');
    }
  }
}
