import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';
import { CustomErrorResponse } from 'src/interfaces/response';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 500;
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
