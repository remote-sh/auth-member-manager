import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { MemberModule } from './modules/member.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validate,
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        stream: pino.destination({
          dest: 'logs/app.log',
          sync: false,
          mkdir: true,
        }),
      },
    }),
    MemberModule,
  ],
})
export class AppModule {}
