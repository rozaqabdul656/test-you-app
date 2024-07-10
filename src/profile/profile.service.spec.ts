import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ProfileService } from './profile.service';
import { Profile, ProfileDocument,ProfileSchema } from './schemas/profile.schema';
import { ProfileDto } from './dto/profile.dto';
import { ProfileModule } from './profile.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './../auth/auth.module';

describe('ProfileService', () => {
  let profileService: ProfileService;
  let profileModel: Model<ProfileDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: (Profile.name),
          useValue: Model,
        },
      ],
      imports: [
        MongooseModule.forRoot(
          'mongodb://rozaq:rozaq@cluster0-shard-00-00.eeeka.mongodb.net:27017,cluster0-shard-00-01.eeeka.mongodb.net:27017,cluster0-shard-00-02.eeeka.mongodb.net:27017/db_abdul_rozaq_betest?replicaSet=atlas-nm186a-shard-0&ssl=true&authSource=admin',
        ),
        MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
        AuthModule,
        ProfileModule,
      ],
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
    profileModel = module.get<Model<ProfileDocument>>((Profile.name));
  });

  describe('save', () => {
    it('should create a new profile when profile with the given userId does not exist', async () => {
      const profileDto: ProfileDto = {
        name: 'testuser',
        gender: 'male',
        height:'12',
        weight:'12',
        images:'', 
        birthday:new Date('2023-01-01'), 
        horoscope:'aries', 
        zodiac:'aries'
      };
      const userId = 'user-id';

      jest.spyOn(profileService, 'findProfileById').mockResolvedValue(null);
      const saveSpy = jest.spyOn(profileModel.prototype, 'save');

      const result = await profileService.save(profileDto, userId);

      expect(profileService.findProfileById).toHaveBeenCalledWith(userId);

      expect(result).toBeDefined();
    });

    it('should update the existing profile when profile with the given userId already exists', async () => {
      const profileDto: ProfileDto = {
        name: 'testuser',
        gender: 'male',
        height:'12',
        weight:'12',
        images:'', 
        birthday:new Date('2023-01-01'), 
        horoscope:'', 
        zodiac:''
      };
      const userId = 'user-id';
      const Profile: Profile = {
        name: 'testuser',
        gender: 'male',
        height:'12',
        weight:'12',
        images:'', 
        birthday:new Date('2023-01-01'), 
        horoscope:'', 
        zodiac:'',
        userId:'324242342'
      };
      jest.spyOn(profileService, 'findProfileById').mockResolvedValue(Profile);
      const updateSpy = jest.spyOn(profileService, 'update');

      const result = await profileService.save(profileDto, userId);

      expect(profileService.findProfileById).toHaveBeenCalledWith(userId);
      expect(updateSpy).toHaveBeenCalledWith(userId, profileDto);
      expect(result).toBeDefined();
    });
  });

  describe('findProfileById', () => {
    it('should return the profile with the given userId', async () => {
      const userId = 'user-id';
      const mockProfile: Profile = {
        name: 'testuser',
        gender: 'male',
        height:'12',
        weight:'12',
        images:'', 
        birthday:new Date('2023-01-01'), 
        horoscope:'', 
        zodiac:'',
        userId:'234'
      };
      jest.spyOn(profileModel, 'findOne').mockResolvedValue(mockProfile);

      const result = await profileService.findProfileById(userId);

      expect(profileModel.findOne).toHaveBeenCalledWith({ userId });
      expect(result).toEqual(mockProfile);
    });

    it('should return null if no profile with the given userId is found', async () => {
      const userId = 'user-id';
      jest.spyOn(profileModel, 'findOne').mockResolvedValue(null);

      const result = await profileService.findProfileById(userId);

      expect(profileModel.findOne).toHaveBeenCalledWith({ userId });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update the profile with the given userId and return the updated profile', async () => {
      const userId = 'user-id';
      const updatedDataDto: ProfileDto = {
        name: 'testuser',
        gender: 'male',
        height:'12',
        weight:'12',
        images:'', 
        birthday:new Date('2023-01-01'), 
        horoscope:'', 
        zodiac:''
      };
      const existingData = {
        _id: 'profile-id',
        username: 'testuser',
        email: 'testuser@example.com',
        save: jest.fn().mockResolvedValue(updatedDataDto), // Mock the save method of the existing profile
      };
      jest.spyOn(profileModel, 'findOneAndUpdate').mockResolvedValue(existingData);

      const result = await profileService.update(userId, updatedDataDto);

      expect(profileModel.findOneAndUpdate).toHaveBeenCalledWith({ userId }, updatedDataDto, {
        new: true,
      });
      expect(result).toEqual(existingData);
    });

    // it('should throw NotFoundException if no profile with the given userId is found', async () => {
    //   const userId = 'user-id';
    //   const updatedDataDto: ProfileDto = {
    //     name: 'testuser',
    //     gender: 'male',
    //     height:'12',
    //     weight:'12',
    //     images:'', 
    //     birthday:new Date('2023-01-01'), 
    //     horoscope:'', 
    //     zodiac:''
    //   };
    //   jest.spyOn(profileModel, 'findOneAndUpdate').mockResolvedValue(null);

    //    await expect(profileService.update(userId,updatedDataDto));
    // });
  });
});