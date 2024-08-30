import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'app.module';
import { PrismaService } from 'prisma/prisma.service';
import * as argon from 'argon2';
import { faker } from '@faker-js/faker';

describe('Movies E2E', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let adminToken: string;
  let regularToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get(PrismaService);

    await app.init();

    const adminUsername = faker.internet.userName();
    await prismaService.user.create({
      data: {
        name: 'AdminE2E',
        username: adminUsername,
        password: await argon.hash('admin1234'),
        role: 'ADMIN',
      },
    });

    const adminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: adminUsername,
        password: 'admin1234',
      })
      .expect(200);

    adminToken = adminLoginResponse.body.token;

    const regularUsername = faker.internet.userName();
    await prismaService.user.create({
      data: {
        name: 'RegularE2E',
        username: regularUsername,
        password: await argon.hash('regular1234'),
        role: 'REGULAR',
      },
    });

    const regularLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: regularUsername,
        password: 'regular1234',
      })
      .expect(200);

    regularToken = regularLoginResponse.body.token;
  });

  jest.setTimeout(10000);

  it('/movies (POST) should create a new movie from the Star Wars API', async () => {
    await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        episodeId: 4,
      })
      .expect(201)
      .expect(response => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.episodeId).toEqual(4);
      });
  });

  it('/movies/:id (GET) should return the details of a specific movie', async () => {
    const uniqueEpisodeId = Math.floor(Math.random() * 1000);
    const newMovie = await prismaService.movie.create({
      data: {
        title: 'Test Movie',
        director: 'Test Director',
        producer: 'Test Producer',
        releaseDate: new Date(),
        episodeId: uniqueEpisodeId,
        openingCrawl: 'Test Opening Crawl',
      },
    });

    await request(app.getHttpServer())
      .get(`/movies/${newMovie.id}`)
      .set('Authorization', `Bearer ${regularToken}`)
      .expect(200)
      .expect(response => {
        expect(response.body).toHaveProperty('id', newMovie.id);
        expect(response.body).toHaveProperty('title', 'Test Movie');
      });
  });

  it('/movies/:id (PUT) should update an existing movie', async () => {
    const uniqueEpisodeId = Math.floor(Math.random() * 1000);
    const newMovie = await prismaService.movie.create({
      data: {
        title: 'Update Test Movie',
        director: 'Update Test Director',
        producer: 'Update Test Producer',
        releaseDate: new Date(),
        episodeId: uniqueEpisodeId,
        openingCrawl: 'Update Test Opening Crawl',
      },
    });

    const updatedTitle = 'Updated Movie Title';

    await request(app.getHttpServer())
      .put(`/movies/${newMovie.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: updatedTitle,
      })
      .expect(200)
      .expect(response => {
        expect(response.body).toHaveProperty('id', newMovie.id);
        expect(response.body).toHaveProperty('title', updatedTitle);
      });
  });

  it('/movies/:id (DELETE) should delete a movie by ID', async () => {
    const uniqueEpisodeId = 2;
    const newMovie = await prismaService.movie.create({
      data: {
        title: 'Delete Test Movie',
        director: 'Delete Test Director',
        producer: 'Delete Test Producer',
        releaseDate: new Date(),
        episodeId: uniqueEpisodeId,
        openingCrawl: 'Delete Test Opening Crawl',
      },
    });

    await request(app.getHttpServer())
      .delete(`/movies/${newMovie.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const deletedMovie = await prismaService.movie.findUnique({
      where: { id: newMovie.id },
    });

    expect(deletedMovie).toBeNull();
  });

  afterAll(async () => {
    await prismaService.movie.deleteMany({
      where: {
        OR: [
          { title: 'Test Movie' },
          { title: 'Updated Movie Title' },
          { episodeId: 4 },
        ],
      },
    });
    await prismaService.user.deleteMany({
      where: {
        OR: [{ name: 'AdminE2E' }, { name: 'RegularE2E' }],
      },
    });

    await app.close();
  });
});
