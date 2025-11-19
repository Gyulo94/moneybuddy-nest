console.log('[VERY_EARLY_DEBUG] Main TS file loaded and starting bootstrap');

import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiInterceptor } from './global/api/api.interceptor';
import { HttpExceptionFilter } from './global/filter/http-exception.filter';
import { winstonLogger } from './global/utils/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = winstonLogger;
  app.setGlobalPrefix('api');
  app.useLogger(logger);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const reflector = app.get(Reflector);
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalInterceptors(new ApiInterceptor(reflector));
  console.log(`[MY_DEBUG] Raw process.env.PORT: ${process.env.PORT}`);
  const portToListen = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;
  console.log(`[MY_DEBUG] Parsed port to listen: ${portToListen}`);
  await app.listen(portToListen);
  console.log(
    `[MY_DEBUG] Nest application successfully started on port ${portToListen}`,
  );
}
bootstrap();
