import {
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GatewayGuard } from 'src/guard/gateway.guard';
import { MemberGuard } from 'src/guard/member.guard';
import { ProfileService } from 'src/services/profile.service';
import { ReplyData } from 'src/types/response';

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

    const reply: ReplyData = {
      message: 'Profile retrieved',
      data: {
        email,
        ...profile,
      },
    };

    return reply;
  }
}
