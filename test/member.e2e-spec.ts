import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/services/prisma.service';
import { createTestMember, prismaService } from './setup-e2e';
import request from 'supertest';
import { member } from '@prisma/client';

describe('Member', () => {
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

  describe('[GET] /member/profile', () => {
    let testMember: member;

    beforeEach(async () => {
      testMember = await createTestMember('test@test.com');
    });

    it('should return 200', async () => {
      const response = await request(app.getHttpServer())
        .get('/member/profile')
        .set('x-uuid', testMember.uuid_key)
        .set('x-gateway-secret', process.env.GATEWAY_SECRET || '');

      expect(response.statusCode).toBe(200);
    });

    it('should return 401 if x-gateway-secret is not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/member/profile')
        .set('x-uuid', testMember.uuid_key);

      expect(response.statusCode).toBe(401);
    });

    it('should return 401 if x-uuid is not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/member/profile')
        .set('x-gateway-secret', process.env.GATEWAY_SECRET || '');

      expect(response.statusCode).toBe(401);
    });
  });

  describe('[PUT] /member/profile', () => {
    let testMember: member;

    beforeEach(async () => {
      testMember = await createTestMember('test@test.com');
    });

    it('should return 200', async () => {
      const response = await request(app.getHttpServer())
        .put('/member/profile')
        .set('x-uuid', testMember.uuid_key)
        .set('x-gateway-secret', process.env.GATEWAY_SECRET || '')
        .send({
          nickname: 'test1',
          imageUrl: 'test1',
        });

      expect(response.statusCode).toBe(200);
    });

    it('should return 401 if x-gateway-secret is not provided', async () => {
      const response = await request(app.getHttpServer())
        .put('/member/profile')
        .set('x-uuid', testMember.uuid_key)
        .send({
          nickname: 'test1',
          imageUrl: 'test1',
        });

      expect(response.statusCode).toBe(401);
    });

    it('should return 401 if x-uuid is not provided', async () => {
      const response = await request(app.getHttpServer())
        .put('/member/profile')
        .set('x-gateway-secret', process.env.GATEWAY_SECRET || '')
        .send({
          nickname: 'test1',
          imageUrl: 'test1',
        });

      expect(response.statusCode).toBe(401);
    });
  });
});
