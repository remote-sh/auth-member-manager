import { Module } from '@nestjs/common';
import { MemberController } from 'src/controllers/member.controller';
import { MemberService } from 'src/services/member.service';
import { PrismaService } from 'src/services/prisma.service';
import { ProfileService } from 'src/services/profile.service';

@Module({
  controllers: [MemberController],
  providers: [PrismaService, ProfileService, MemberService],
})
export class MemberModule {}
