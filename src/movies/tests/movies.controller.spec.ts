import { Test, TestingModule } from '@nestjs/testing';
import { CreateMovieFromApiDto } from 'movies/dto/create-movie-from-api.dto';
import { CreateMovieDto } from 'movies/dto/create-movie.dto';
import { UpdateMovieDto } from 'movies/dto/update-movie.dto';
import { MoviesController } from 'movies/movies.controller';
import { MoviesService } from 'movies/movies.service';
import { movieStub } from 'movies/tests/stubs/movie.stub';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockMoviesService = {
    findOne: jest.fn().mockResolvedValue(movieStub()),
    findAll: jest.fn().mockResolvedValue([movieStub()]),
    createFromApi: jest.fn().mockResolvedValue(movieStub()),
    createNewMovie: jest.fn().mockResolvedValue(movieStub()),
    update: jest.fn().mockResolvedValue(movieStub()),
    delete: jest.fn().mockResolvedValue(movieStub()),
    syncMoviesFromApi: jest.fn().mockResolvedValue({
      message: 'Movies synchronized successfully',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [{ provide: MoviesService, useValue: mockMoviesService }],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a movie', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual(movieStub());
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([movieStub()]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('createFromApi', () => {
    it('should create a new movie from the Star Wars API', async () => {
      const dto: CreateMovieFromApiDto = { episodeId: 4 };
      const result = await controller.createFromApi(dto);
      expect(result).toEqual(movieStub());
      expect(service.createFromApi).toHaveBeenCalledWith(dto);
    });
  });

  describe('createNewMovie', () => {
    it('should create a new movie', async () => {
      const dto: CreateMovieDto = {
        title: 'New Movie',
        director: 'Director',
        producer: 'Producer',
        episodeId: 5,
        releaseDate: '2022-01-01',
        openingCrawl: 'Test crawl',
      };
      const result = await controller.createNewMovie(dto);
      expect(result).toEqual(movieStub());
      expect(service.createNewMovie).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const dto: UpdateMovieDto = {
        title: 'Updated Movie',
        director: 'Updated Director',
      };
      const result = await controller.update(dto, 1);
      expect(result).toEqual(movieStub());
      expect(service.update).toHaveBeenCalledWith(dto, 1);
    });
  });

  describe('delete', () => {
    it('should delete a movie', async () => {
      const result = await controller.delete(1);
      expect(result).toEqual(movieStub());
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('syncMovies', () => {
    it('should sync movies from the Star Wars API', async () => {
      const result = await controller.syncMovies();
      expect(result).toEqual({
        message: 'Movies synchronized successfully',
      });
      expect(service.syncMoviesFromApi).toHaveBeenCalled();
    });
  });
});
