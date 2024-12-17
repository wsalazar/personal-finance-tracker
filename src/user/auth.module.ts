import {
  Injectable,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { UserModule } from './user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserController } from './user.controller';
import { JwtStrategy } from './jwt.strategy';
import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { AuthMiddleware } from './auth.middleware';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';

dotenv.config(); // Load environment variables
@Module({
  /**
   * todo add token authorization when later
   */
  imports: [
    UserModule,
    //   PassportModule,
    //   JwtModule.register({
    //     secret: process.env.JWT_SECRET,
    //     signOptions: { expiresIn: '60s' },
    //   }),
  ],
  // providers: [AuthService, JwtStrategy, JwtService],
  providers: [AuthService, JwtService],
  controllers: [UserController],
  // exports: [JwtModule, PassportModule],
})
export class AuthModule {}
