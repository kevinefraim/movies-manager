import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'app.module';
import { PrismaService } from 'prisma/prisma.service';
import { faker } from '@faker-js/faker';

describe('Auth E2E', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get(PrismaService);

    await app.init();
  });

  it('/auth/register (POST) should register a new user', async () => {
    const randomUsername = faker.internet.userName();

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'TestE2E',
        username: randomUsername,
        password: 'password123',
      })
      .expect(201);
  });

  it('/auth/login (POST) should log in and return a JWT token', async () => {
    const randomUsername = faker.internet.userName();

    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'TestE2E',
      username: randomUsername,
      password: 'password123',
    });

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: randomUsername,
        password: 'password123',
      })
      .expect(200)
      .expect(response => {
        expect(response.body).toHaveProperty('token');
      });
  });

  afterAll(async () => {
    await prismaService.user.deleteMany({
      where: {
        name: {
          startsWith: 'TestE2E',
        },
      },
    });
    await app.close();
  });
});
