import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async getMember(uuidKey: string) {
    return await this.prisma.member.findUnique({
      where: { uuid_key: uuidKey },
    });
  }

  async deleteMember(uuidKey: string) {
    return await this.prisma.member.delete({
      where: { uuid_key: uuidKey },
    });
  }
}
