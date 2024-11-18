import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { MemberRequest } from 'src/interfaces/request';
import { MemberService } from 'src/services/member.service';

/**
 * Get existing member from passed member uuid key
 * @function canActivate - validate context function
 */
@Injectable()
export class MemberGuard implements CanActivate {
  constructor(
    private readonly memberService: MemberService,
    private logger: PinoLogger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<MemberRequest>();
      const uuid = request.headers['x-uuid'] as string;
      if (!uuid) {
        throw new UnauthorizedException('UUID not provided');
      }
      const targetMember = await this.memberService.getMember(uuid);
      if (!targetMember) {
        throw new NotFoundException('Member not found');
      }
      request.query = {
        ...request.query,
        email: targetMember.email,
        userId: targetMember.id,
      };
      return true;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
