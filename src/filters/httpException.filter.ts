import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomErrorResponse } from 'src/interfaces/response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;
    const name = exception.name;

    const errorResponse: CustomErrorResponse = {
      message: message,
      data: {
        name: name,
      },
    };

    response.status(status).json(errorResponse);
  }
}
