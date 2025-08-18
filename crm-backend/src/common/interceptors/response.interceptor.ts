import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

interface ResponseFormat<T> {
  message?: string;
  data?: T;
  statusCode: number;
  success: boolean;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  private readonly defaultMessage = 'Success';

  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((data) => {
        const res = context.switchToHttp().getResponse<Response>();
        const statusCode = res.statusCode;

        const decoratorMessage = this.reflector.get<string>(
          RESPONSE_MESSAGE_KEY,
          context.getHandler(),
        );

        let message = decoratorMessage ?? this.defaultMessage;

        if (
          data &&
          typeof data === 'object' &&
          'message' in (data as Record<string, unknown>) &&
          (data as Record<string, unknown>).message
        ) {
          message =
            decoratorMessage ??
            (data as Record<string, unknown>).message ??
            this.defaultMessage;
        }

        return {
          statusCode,
          success: true,
          message,
          data,
        };
      }),
    );
  }
}
