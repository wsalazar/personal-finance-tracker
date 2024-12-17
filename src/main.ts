import * as dotenv from 'dotenv';
dotenv.config(); //loads env vars

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { MongoClient } from 'mongodb';
// import * as cookieParser from 'cookie-parser';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const mongoClient = new MongoClient('mongodb://localhost:27017');

  await mongoClient.connect();
  app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        clientPromise: mongoClient.connect(),
        dbName: 'budget-tracker',
        collectionName: 'sessions', //this can be whatever name I want.
        ttl: 14 * 24 * 60 * 60, //session expiration in seconds
      }),
      cookie: { httpOnly: true, secure: false }, // make this true if using https this would be for production. set secure to true for production
    }),
  );
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:8080', // Replace with your Vue.js app's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
