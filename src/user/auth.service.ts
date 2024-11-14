import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { User, UserDocument } from 'src/schemas/user.schema/user.schema';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: {
    email: string;
    password: string;
  }): Promise<User> {
    const email = createUserDto.email;
    const userExists = await this.userService.findByEmail(email);
    if (userExists) {
      throw new ConflictException('User already exists.');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = {
      ...createUserDto,
      password: hashedPassword,
    };

    return await this.userService.register(newUser);
  }

  async login(userDto: { email: string; password: string }): Promise<string> {
    const user = await this.userService.validateUser(userDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      email: user.email,
      sub: (user as UserDocument)._id.toString(),
    };
    // console.log('Payload:', payload);
    // console.log('JWT Secret:', process.env.JWT_SECRET); // Add this line for debugging
    // await this.jwtService.signAsync(payload, { secret: your.secret })

    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
  }

  // findOne(email: string, password: string) {
  //   return this.userModel.findOne({ email: email, password: password }).exec();
  // }

  // remove(id: string) {
  //   return this.userModel.deleteOne({ _id: Object(id) }).exec();
  // }
}
