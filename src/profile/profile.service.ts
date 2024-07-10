import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {}

  async save(profileDto: ProfileDto, userId: string): Promise<Profile> {
    const profileValidation=await this.findProfileById(userId);
    if (!profileValidation){
      return await new this.profileModel({
        ...profileDto,
        userId,
        createdAt: new Date(),
      }).save();
    } 
    return await this.update(userId,profileDto);
  }

  async findProfileById(userId: string): Promise<Profile> {
    return await this.profileModel.findOne({ userId });
  }
  async update(userId: string, updatedDataDto: ProfileDto): Promise<Profile> {
    const existingData = await this.profileModel.findOneAndUpdate(
      { userId },
      updatedDataDto,
      { new: true },
    );
    if (!existingData) {
      throw new NotFoundException(`Invalid Data Id`);
    }
    return existingData;
  }

}
