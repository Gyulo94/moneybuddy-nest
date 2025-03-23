import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}
  use(req: Request, res: Response, next: Function) {
    this.logger.log(
      JSON.stringify({
        url: req.url,
        query: req.query,
        body: req.body,
      }),
    );
    next();
  }
}
