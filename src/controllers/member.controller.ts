import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { provider_type } from '@prisma/client';
import { GatewayGuard } from 'src/guard/gateway.guard';
import { MemberGuard } from 'src/guard/member.guard';
import { UpdateMemberBody } from 'src/interfaces/member/update';
import { CustomResponse } from 'src/interfaces/response';
import { ProfileService } from 'src/services/profile.service';

@Controller('member')
@UseGuards(GatewayGuard, MemberGuard)
export class MemberController {
  constructor(private profileService: ProfileService) {}

  @Get('profile')
  @HttpCode(200)
  async getProfile(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('email') email: string,
  ) {
    const profile = await this.profileService.getProfile(userId);

    const reply: CustomResponse<{
      email: string;
      imageUrl: string | null;
      nickname: string;
      joinDate: Date;
      updateDate: Date;
      provider: provider_type;
    }> = {
      message: 'Profile retrieved',
      data: {
        email,
        imageUrl: profile.image_url,
        nickname: profile.nickname,
        joinDate: profile.join_date,
        updateDate: profile.update_date,
        provider: profile.provider,
      },
    };

    return reply;
  }

  @Put('profile')
  @HttpCode(200)
  async updateProfile(
    @Query('userId', ParseIntPipe) userId: number,
    @Body() body: UpdateMemberBody,
  ) {
    if (body.nickname) {
      await this.profileService.updateNickname(userId, body.nickname);
    }

    if (body.imageUrl) {
      await this.profileService.updateAvatar(userId, body.imageUrl);
    }

    const reply: CustomResponse = {
      message: 'Profile updated',
      data: undefined,
    };

    return reply;
  }
}
