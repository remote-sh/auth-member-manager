import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { Env } from 'src/schemas/env.schema';

/**
 * This guard exist to ensure the request passed through gateway
 * @function canActivate - validate context function
 */
@Injectable()
export class GatewayGuard implements CanActivate {
  constructor(
    private config: ConfigService<Env, true>,
    private logger: PinoLogger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const gateway = request.headers['x-gateway-secret'];
    if (gateway !== this.config.get<Env['gateway']>('gateway').secret) {
      this.logger.error('Invalid gateway secret');
      throw new UnauthorizedException('Invalid gateway secret');
    }
    return true;
  }
}
