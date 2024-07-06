import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { IConfig, IGatewayConfig } from 'src/types/config';

@Injectable()
export class GatewayGuard implements CanActivate {
  constructor(
    private config: ConfigService<IConfig, true>,
    private logger: PinoLogger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const gateway = request.headers['x-gateway-secret'];
    if (gateway !== this.config.get<IGatewayConfig>('gateway').secret) {
      this.logger.error('Invalid gateway secret');
      throw new UnauthorizedException('Invalid gateway secret');
    }
    return true;
  }
}
