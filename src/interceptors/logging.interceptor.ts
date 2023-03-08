import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';
import { LogService } from 'src/db/log.service';
import { LogRequestDto } from 'src/dto/request/log.request.dto';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logId: number;
  constructor(private logservice: LogService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    try {
      const { body, route, user, headers, method, query } = request;
      const userId = user?.userId;
      const host = headers.host;
      const path = route.path;
      const log = new LogRequestDto(host, path, method, body, query, userId);
      const generated = await this.logservice.addlog(log);
      this.logId = generated.identifiers[0].requestId;
    } catch (error) {
      console.log(error);
    } finally {
      return next
        .handle()
        .pipe(
          map(async (value) => {
            this.logservice.addLogResponse(this.logId, value);
            return value;
          }),
        )
        .pipe(
          catchError((err) => {
            this.logservice.addLogResponse(this.logId, err.response);
            throw err;
          }),
        );
    }
  }
}
