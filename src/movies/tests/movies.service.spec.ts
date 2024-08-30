import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { of } from 'rxjs';
import { MoviesService } from 'movies/movies.service';
import { PrismaService } from 'prisma/prisma.service';
import { movieApiStub, movieStub } from 'movies/tests/stubs/movie.stub';

describe('MoviesService', () => {
  let service: MoviesService;
  let prismaService: PrismaService;
  let httpService: HttpService;

  const mockPrismaService = {
    movie: {
      findUnique: jest.fn().mockResolvedValue(movieStub()),
      findMany: jest.fn().mockResolvedValue([movieStub()]),
      create: jest.fn().mockResolvedValue(movieStub()),
      update: jest.fn().mockResolvedValue(movieStub()),
      delete: jest.fn().mockResolvedValue(movieStub()),
    },
  };

  const mockHttpService = {
    get: jest.fn().mockReturnValue(
      of({
        data: {
          results: [movieStub()],
        },
      }),
    ),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('http://fakeapi.com'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    prismaService = module.get<PrismaService>(PrismaService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a movie if found', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(movieStub());
      expect(prismaService.movie.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if movie not found', async () => {
      jest.spyOn(prismaService.movie, 'findUnique').mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createFromApi', () => {
    it('should create a new movie from the Star Wars API', async () => {
      jest.spyOn(prismaService.movie, 'findUnique').mockResolvedValueOnce(null);

      jest
        .spyOn(service, 'findAllFromApi')
        .mockResolvedValueOnce([movieApiStub()]);

      const result = await service.createFromApi({ episodeId: 4 });
      expect(result).toEqual(movieStub());
      expect(prismaService.movie.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if movie with episode ID already exists', async () => {
      await expect(service.createFromApi({ episodeId: 4 })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if episode does not exist', async () => {
      jest.spyOn(prismaService.movie, 'findUnique').mockResolvedValueOnce(null);

      jest.spyOn(service, 'findAllFromApi').mockResolvedValueOnce([]);

      await expect(service.createFromApi({ episodeId: 99 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a movie if it exists', async () => {
      const result = await service.update({ title: 'Updated Title' }, 1);
      expect(result).toEqual(movieStub());
      expect(prismaService.movie.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: 'Updated Title' },
      });
    });

    it('should throw NotFoundException if movie not found', async () => {
      jest.spyOn(prismaService.movie, 'findUnique').mockResolvedValueOnce(null);

      await expect(
        service.update({ title: 'Updated Title' }, 999),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if episode ID is already used', async () => {
      jest
        .spyOn(prismaService.movie, 'findUnique')
        .mockResolvedValueOnce(movieStub());

      await expect(service.update({ episodeId: 4 }, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a movie if it exists', async () => {
      const result = await service.delete(1);
      expect(result).toEqual(movieStub());
      expect(prismaService.movie.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if movie not found', async () => {
      jest.spyOn(prismaService.movie, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('syncMoviesFromApi', () => {
    it('should sync movies from the Star Wars API', async () => {
      jest
        .spyOn(service, 'findAllFromApi')
        .mockResolvedValueOnce([movieApiStub()]);

      jest.spyOn(prismaService.movie, 'findUnique').mockResolvedValueOnce(null);

      const result = await service.syncMoviesFromApi();
      expect(result).toEqual({ message: 'Movies synchronized successfully' });
      expect(prismaService.movie.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: movieApiStub().title,
          episodeId: movieApiStub().episode_id,
        }),
      });
    });
  });
});
