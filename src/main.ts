console.log('[VERY_EARLY_DEBUG] Main TS file loaded and starting bootstrap');

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
  });
  // const logger = winstonLogger;
  app.setGlobalPrefix('api');
  // app.useLogger(logger);
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
  // const reflector = app.get(Reflector);
  // app.useGlobalFilters(new HttpExceptionFilter(logger));
  // app.useGlobalInterceptors(new ApiInterceptor(reflector));
  console.log(`[MY_DEBUG] Raw process.env.PORT: ${process.env.PORT}`);
  const portToListen = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;
  console.log(`[MY_DEBUG] Parsed port to listen: ${portToListen}`);
  await app.listen(portToListen);
  console.log(
    `[MY_DEBUG] Nest application successfully started on port ${portToListen}`,
  );
}
bootstrap();
console.log('--- bootstrap() 함수 종료 후 (이게 찍히면 문제!) ---');
