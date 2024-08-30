import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from '../movies.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { MoviesApi, movieDto, movies } from './stubs/movie.stub';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: PrismaService,
          useValue: {
            movie: {
              findUnique: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        ConfigService,
      ],
      imports: [
        PrismaModule,
        HttpModule,
        ConfigModule.forRoot({ isGlobal: true }),
      ],
    }).compile();

    service = module.get(MoviesService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of movies', async () => {
      jest
        .spyOn(service['movieEntity'], 'findMany')
        .mockResolvedValueOnce(movies);

      const result = await service.findAll();

      expect(result).toEqual(movies);
    });
  });
  describe('findOne', () => {
    it('should throw NotFoundException if movie with the given ID does not exist', async () => {
      jest
        .spyOn(service['movieEntity'], 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(service['movieEntity'].findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return the movie with the given ID if it exists', async () => {
      jest
        .spyOn(service['movieEntity'], 'findUnique')
        .mockResolvedValueOnce(movies[0]);

      const result = await service.findOne(1);

      expect(result).toEqual(movies[0]);
      expect(service['movieEntity'].findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
  describe('createNewMovie', () => {
    it('should throw BadRequestException if movie with the same episode ID exists', async () => {
      jest
        .spyOn(service['movieEntity'], 'findUnique')
        .mockResolvedValueOnce(movies[0]);

      await expect(service.createNewMovie(movieDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if movie with the same episode ID exists in the API', async () => {
      jest
        .spyOn(service['movieEntity'], 'findUnique')
        .mockResolvedValueOnce(null);
      jest.spyOn(service, 'findAllFromApi').mockResolvedValueOnce(MoviesApi);

      await expect(service.createNewMovie(movieDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a new movie if no movie with the same episode ID exists', async () => {
      jest
        .spyOn(service['movieEntity'], 'findUnique')
        .mockResolvedValueOnce(null);
      jest.spyOn(service, 'findAllFromApi').mockResolvedValueOnce([]);

      await service.createNewMovie(movieDto);

      expect(service['movieEntity'].create).toHaveBeenCalledWith({
        data: {
          ...movieDto,
          releaseDate: new Date(movieDto.releaseDate),
        },
      });
    });
  });
  describe('createFromApi', () => {
    it('should throw BadRequestException if movie with the same episode ID exists', async () => {
      jest
        .spyOn(service['movieEntity'], 'findUnique')
        .mockResolvedValueOnce(movies[0]);

      await expect(service.createFromApi({ episodeId: 1 })).rejects.toThrow(
        BadRequestException,
      );
      expect(service['movieEntity'].findUnique).toHaveBeenCalledWith({
        where: { episodeId: 1 },
      });
      expect(service['movieEntity'].create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if episode does not exist', async () => {
      jest
        .spyOn(service['movieEntity'], 'findUnique')
        .mockResolvedValueOnce(null);
      jest.spyOn(service, 'findAllFromApi').mockResolvedValueOnce(MoviesApi);

      await expect(service.createFromApi({ episodeId: 100 })).rejects.toThrow(
        NotFoundException,
      );
      expect(service['movieEntity'].findUnique).toHaveBeenCalledWith({
        where: { episodeId: 100 },
      });
      expect(service.findAllFromApi).toHaveBeenCalled();
      expect(service['movieEntity'].create).not.toHaveBeenCalled();
    });

    it('should create a new movie if no movie with the same episode ID exists and episode exists', async () => {
      jest
        .spyOn(service['movieEntity'], 'findUnique')
        .mockResolvedValueOnce(null);
      jest.spyOn(service, 'findAllFromApi').mockResolvedValueOnce(MoviesApi);
      jest
        .spyOn(service['movieEntity'], 'create')
        .mockResolvedValueOnce(movies[0]);

      const result = await service.createFromApi({ episodeId: 1 });

      expect(result).toEqual(movies[0]);
      expect(service['movieEntity'].findUnique).toHaveBeenCalledWith({
        where: { episodeId: 1 },
      });
      expect(service.findAllFromApi).toHaveBeenCalled();
      expect(service['movieEntity'].create).toHaveBeenCalledWith({
        data: expect.any(Object),
      });
    });
  });
  describe('update', () => {
    it('should throw NotFoundException if movie with the given ID does not exist', async () => {
      jest
        .spyOn(service['movieEntity'], 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(service.update(movieDto, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(service['movieEntity'].findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw BadRequestException if movie with the updated episode ID already exists in the database', async () => {
      jest
        .spyOn(service['movieEntity'], 'findUnique')
        .mockResolvedValueOnce({ ...movies[0], id: 1, episodeId: 4 });
      jest
        .spyOn(service['movieEntity'], 'findUnique')
        .mockResolvedValueOnce({ ...movies[0], id: 2 });

      await expect(
        service.update({ ...movieDto, episodeId: 4 }, 1),
      ).rejects.toThrow(BadRequestException);
      expect(service['movieEntity'].findUnique).toHaveBeenCalledWith({
        where: { episodeId: 4 },
      });
    });

    it('should throw BadRequestException if movie with the updated episode ID already exists in the API', async () => {
      jest
        .spyOn(service['movieEntity'], 'findUnique')
        .mockResolvedValueOnce({ ...movies[0], id: 1, episodeId: 4 });
      jest
        .spyOn(service['movieEntity'], 'findUnique')
        .mockResolvedValueOnce(null);
      jest.spyOn(service, 'findAllFromApi').mockResolvedValueOnce(MoviesApi);

      await expect(service.update(movieDto, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should update the movie with the given ID if no issues are found', async () => {
      jest
        .spyOn(service['movieEntity'], 'findUnique')
        .mockResolvedValueOnce({ ...movies[0], id: 1, episodeId: 4 });
      jest
        .spyOn(service['movieEntity'], 'findUnique')
        .mockResolvedValueOnce(null);

      await service.update({ ...movieDto, episodeId: 1201 }, 1);

      expect(service['movieEntity'].update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...movieDto,
          episodeId: 1201,
          ...(movieDto.releaseDate && {
            releaseDate: new Date(movieDto.releaseDate),
          }),
        },
      });
    });
  });
  describe('delete', () => {
    it('should throw NotFoundException if movie with the given ID does not exist', async () => {
      jest
        .spyOn(service['movieEntity'], 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
      expect(service['movieEntity'].findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(service['movieEntity'].delete).not.toHaveBeenCalled();
    });

    it('should delete the movie with the given ID if it exists', async () => {
      jest
        .spyOn(service['movieEntity'], 'findUnique')
        .mockResolvedValueOnce(movies[0]);

      await service.delete(1);

      expect(service['movieEntity'].findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(service['movieEntity'].delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
