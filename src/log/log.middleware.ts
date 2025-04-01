import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}
  use(req: Request, res: Response, next: () => void) {
    this.logger.info(
      `Request: ${req.method} ${req.url} - Body: ${JSON.stringify(req.body)}`,
    );
    next();
  }
}
