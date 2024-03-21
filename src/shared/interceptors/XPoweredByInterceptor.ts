import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class XPoweredByInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const res: Response = context.switchToHttp().getResponse();
    res.setHeader('x-powered-by', 'AI Server on Express/NestJS');
    return next.handle();
  }
}
