import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(registerDto: RegisterDto): Promise<User> {
    return await new this.userModel({
      ...registerDto,
      createdAt: new Date(),
    }).save();
  }

  async findByEmailUsername(email: string, username: string): Promise<User> {
    return this.userModel.findOne({ email, username }).exec();
  }
  async Login(loginDto: LoginDto): Promise<User> {
    const UsersData = await this.userModel
      .findOne({
        $or: [{ email: loginDto.email }, { username: loginDto.email }],
      })
      .exec();
    if (!UsersData) {
      throw new NotFoundException(`Users Not Founded`);
    }
    try {
      //comparing process

      const isMatch = await bcrypt.compare(
        loginDto.password,
        UsersData['password'],
      );
      if (isMatch) {
        return UsersData;
      }
      throw new NotFoundException(`Users Not Founded`);
    } catch (error) {
      throw error;
    }
  }
}
