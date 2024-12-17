import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User, UserSchema } from 'src/schemas/user.schema/user.schema';
import { UserController } from './user.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  /**
   * todo add providers later when I use tokens for authorization
   */
  // providers: [UserService, AuthService, JwtService],
  providers: [UserService, AuthService, JwtService],
  exports: [UserService, AuthService],
})
export class UserModule {}
