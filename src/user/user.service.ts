import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async validateUser(userDto: {
    email: string;
    password: string;
  }): Promise<User | null> {
    const user = await this.findByEmail(userDto.email);
    if (user && (await bcrypt.compare(userDto.password, user.password))) {
      return user;
    }
    return null;
  }

  async register(createUserDto: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const createUser = new this.userModel(createUserDto);
    return createUser.save();
  }

  async findOne(email: string, password: string) {
    return this.userModel.findOne({ email: email, password: password }).exec();
  }

  async remove(id: string): Promise<void> {
    await this.userModel.deleteOne({ _id: Object(id) }).exec();
  }
}
