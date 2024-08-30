import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from '../movies.controller';
import { MoviesService } from '../movies.service';
import { movieDto, movies } from './stubs/movie.stub';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService, PrismaService, ConfigService],
      imports: [
        PrismaModule,
        HttpModule,
        ConfigModule.forRoot({ isGlobal: true }),
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return the movie with the given ID', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(movies[0]);

      const result = await controller.findOne(1);
      expect(result).toEqual(movies[0]);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });
  describe('findAll', () => {
    it('should return all movies', async () => {
      const expectedResult = movies;
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('createFromApi', () => {
    it('should create a movie from API data', async () => {
      const createdMovie = movies[0];
      jest.spyOn(service, 'createFromApi').mockResolvedValueOnce(createdMovie);

      const result = await controller.createFromApi(movieDto);

      expect(result).toEqual(createdMovie);
      expect(service.createFromApi).toHaveBeenCalledWith(movieDto);
    });
  });
  describe('createNewMovie', () => {
    it('should create a new movie', async () => {
      const createdMovie = movies[0];
      jest.spyOn(service, 'createNewMovie').mockResolvedValueOnce(createdMovie);

      const result = await controller.createNewMovie(movieDto);

      expect(result).toEqual(createdMovie);
      expect(service.createNewMovie).toHaveBeenCalledWith(movieDto);
    });
  });

  describe('update', () => {
    it('should update the movie with the given ID', async () => {
      const updatedMovie = movies[0];
      jest.spyOn(service, 'update').mockResolvedValueOnce(updatedMovie);

      const result = await controller.update(movieDto, 1);

      expect(result).toEqual(updatedMovie);
      expect(service.update).toHaveBeenCalledWith(movieDto, 1);
    });
  });
  describe('delete', () => {
    it('should delete the movie with the given ID', async () => {
      const id = 1;
      jest.spyOn(service, 'delete').mockResolvedValueOnce(movies[0]);

      const result = await controller.delete(id);

      expect(result).toEqual(movies[0]);
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
