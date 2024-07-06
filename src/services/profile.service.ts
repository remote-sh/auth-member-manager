import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private logger: PinoLogger,
  ) {}

  async getProfile(userId: number) {
    this.logger.info(`Getting profile with id ${userId}`);
    const profile = await this.prisma.profile.findUnique({
      where: { user_id: userId },
    });
    if (!profile) {
      this.logger.error(`Profile with id ${userId} not found`);
      throw new NotFoundException(`Profile not found`);
    }
    return profile;
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
