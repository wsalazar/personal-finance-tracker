import * as dotenv from 'dotenv';
dotenv.config(); //loads env vars

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:8080', // Replace with your Vue.js app's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
