import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './filters/httpException.filter';
import { PrismaExceptionFilter } from './filters/prismaException.filter';
import { IConfig } from './types/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  const config = app.get(ConfigService<IConfig, true>);

  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());

  await app.listen(config.get<number>('port'));
  logger.log(`Server is running on: ${await app.getUrl()}`);
}
bootstrap();
