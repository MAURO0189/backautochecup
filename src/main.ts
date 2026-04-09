import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
//import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const allowedHosts = [];

  const devHost = [
    'http://localhost:3000',
    'http://localhost:4200',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5500',
  ];

  const app = await NestFactory.create(AppModule);

  //app.useGlobalFilters(new AllExceptionsFilter());

  app.use(cookieParser());

  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      },
    }),
  );

  app.use(
    helmet({
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? allowedHosts : devHost,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
