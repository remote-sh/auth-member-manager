import { PrismaClient, profile, provider, provider_type } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { ProfileService } from './profile.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';

describe('ProfileService', () => {
  let service: ProfileService;
  let prismaMock: DeepMockProxy<PrismaClient>;
  let logger: DeepMockProxy<PinoLogger>;

  const profile: profile = {
    id: 1,
    user_id: 1,
    nickname: 'test',
    image_url: 'test',
    join_date: new Date(),
    update_date: new Date(),
  };
  const provider: provider = {
    id: 1,
    user_id: 1,
    provider: provider_type.google,
  };

  beforeEach(async () => {
    // Mock PrismaService
    prismaMock = mockDeep<PrismaClient>();
    logger = mockDeep<PinoLogger>();

    // Create testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: PinoLogger,
          useValue: logger,
        },
      ],
    }).compile();
    service = module.get<ProfileService>(ProfileService);

    // Mock $transaction
    prismaMock.$transaction.mockImplementation((callback) =>
      callback(prismaMock),
    );
  });

  describe('getProfile', () => {
    it('should return a profile', async () => {
      // Mock findUnique
      prismaMock.profile.findUnique.mockResolvedValue(profile);
      prismaMock.provider.findUnique.mockResolvedValue(provider);

      // Call getProfile
      const result = await service.getProfile(1);

      // Check result
      expect(result).toEqual({
        nickname: 'test',
        image_url: 'test',
        join_date: profile.join_date,
        update_date: profile.update_date,
        provider: provider.provider,
      });
    });
  });

  describe('updateNickname', () => {
    it('should return an updated profile', async () => {
      // Mock update
      prismaMock.profile.update.mockResolvedValue({
        ...profile,
        nickname: 'updated',
      });

      // Call updateNickname
      const result = await service.updateNickname(1, 'updated');

      // Check result
      expect(result.nickname).toEqual('updated');
    });
  });

  describe('updateAvatar', () => {
    it('should return an updated profile', async () => {
      // Mock update
      prismaMock.profile.update.mockResolvedValue({
        ...profile,
        image_url: 'updated',
      });

      // Call updateAvatar
      const result = await service.updateAvatar(1, 'updated');

      // Check result
      expect(result.image_url).toEqual('updated');
    });
  });

  describe('deleteProfile', () => {
    it('should return a deleted profile', async () => {
      // Mock delete
      prismaMock.profile.delete.mockResolvedValue(profile);

      // Call deleteProfile
      const result = await service.deleteProfile(1);

      // Check result
      expect(result).toEqual(profile);
    });
  });
});
