import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { startEmbeddedDbIfNeeded } from './database/embedded-db';
import { runSeed } from './database/seeder';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  await startEmbeddedDbIfNeeded();

  const app = await NestFactory.create(AppModule, { cors: false });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.setGlobalPrefix('api', { exclude: ['/'] });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  if (process.env.AUTO_SEED !== 'false') {
    try {
      const dataSource = app.get(DataSource);
      await runSeed(dataSource);
      logger.log('시드 데이터 확인 완료');
    } catch (err) {
      logger.error('시드 실행 중 오류', err as Error);
    }
  }

  const port = Number(process.env.PORT ?? process.env.BACKEND_PORT ?? 3001);
  await app.listen(port, '0.0.0.0');
  logger.log(`천상고 API 서버가 http://localhost:${port}/api 에서 실행 중입니다.`);
}

bootstrap();
