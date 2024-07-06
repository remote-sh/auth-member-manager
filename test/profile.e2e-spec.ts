import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/services/prisma.service';
import { prismaService } from './setup-e2e';
import request from 'supertest';

describe('Profile', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[GET] /profile', () => {
    it('should return 200', async () => {
      const response = await request(app.getHttpServer()).get('/profile')

      expect(response.statusCode).toBe(200);
    });
  });
});
