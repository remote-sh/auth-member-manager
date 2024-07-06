import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PinoLogger } from 'nestjs-pino';
import { provider_type } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private logger: PinoLogger,
  ) {}

  async getProfile(userId: number): Promise<{
    nickname: string;
    image_url: string | null;
    join_date: Date;
    update_date: Date;
    provider: provider_type;
  }> {
    this.logger.info(`Getting profile with id ${userId}`);
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
    });
    if (!profile) {
      this.logger.error(`Profile with id ${userId} not found`);
      throw new NotFoundException(`Profile not found`);
    }
    const provider = await this.prisma.provider.findUnique({
      where: { user_id: userId },
    });
    if (!provider) {
      this.logger.error(`Provider with id ${userId} not found`);
      throw new NotFoundException(`Provider not found`);
    }

    return {
      nickname: profile.nickname,
      image_url: profile.image_url,
      join_date: profile.join_date,
      update_date: profile.update_date,
      provider: provider.provider,
    };
  }

  async updateNickname(userId: number, nickname: string) {
    const profile = await this.prisma.profile.update({
      where: { user_id: userId },
      data: { nickname, update_date: new Date() },
    });
    this.logger.info(`Profile with id ${userId} updated`);
    return profile;
  }

  async updateAvatar(userId: number, imageUrl: string) {
    const profile = await this.prisma.profile.update({
      where: { user_id: userId },
      data: { image_url: imageUrl, update_date: new Date() },
    });
    this.logger.info(`Profile with id ${userId} updated`);
    return profile;
  }

  async deleteProfile(userId: number) {
    const profile = await this.prisma.profile.delete({
      where: { user_id: userId },
    });
    this.logger.warn(`Profile with id ${userId} deleted`);
    return profile;
  }
}
