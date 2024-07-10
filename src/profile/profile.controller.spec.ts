import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/profile.dto';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { AuthModule } from './../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

describe('ProfileController', () => {
  let profileController: ProfileController;
  let profileService: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [ProfileService],
      imports: [
        MongooseModule.forRoot('mongodb://rozaq:rozaq@cluster0-shard-00-00.eeeka.mongodb.net:27017,cluster0-shard-00-01.eeeka.mongodb.net:27017,cluster0-shard-00-02.eeeka.mongodb.net:27017/db_abdul_rozaq_betest?replicaSet=atlas-nm186a-shard-0&ssl=true&authSource=admin'),
        MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
        AuthModule,
      ],
    }).compile();

    profileController = module.get<ProfileController>(ProfileController);
    profileService = module.get<ProfileService>(ProfileService);
  });

  describe('createProfile', () => {
    it('should create profile and return success response', async () => {
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
      const mockFile = { filename: 'test-image.jpg' };
      const mockUserSub = 'user-id';
      jest.spyOn(profileController, 'detectionZodiacRender').mockResolvedValue({
        zodiac: 'Aries',
        horoscope: 'Ram',
      });
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
      profileDto.zodiac='Aries';
      profileDto.horoscope='Ram';
      jest.spyOn(profileService, 'save').mockResolvedValue(Profile);

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await profileController.createProfile(
        { user: { sub: mockUserSub } } as any, // Mocking the request object
        response as any, // Mocking the response object
        mockFile as any, // Mocking the uploaded file
        profileDto,
      );

      expect(profileController.detectionZodiacRender).toHaveBeenCalledWith(profileDto.birthday);
      expect(profileService.save).toHaveBeenCalledWith(
        { ...profileDto, images: mockFile.filename },
        mockUserSub,
      );
      expect(response.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(response.json).toHaveBeenCalledWith({
        message: 'Succes',
        statusCode: HttpStatus.OK,
      });
    });
  });

  describe('getProfile', () => {
    it('should get the user profile and return success response', async () => {
      const mockUserId = 'user-id';
      const mockProfileData:Profile = {
        name: 'testuser',
        gender: 'male',
        height:'12',
        weight:'12',
        images:'', 
        birthday:new Date('2023-01-01'), 
        horoscope:'', 
        zodiac:'',
        userId:'23232',
      };
      jest.spyOn(profileService, 'findProfileById').mockResolvedValue(mockProfileData);

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await profileController.getProfile(
        { user: { sub: mockUserId } } as any, // Mocking the request object
        response as any, // Mocking the response object
      );

      expect(profileService.findProfileById).toHaveBeenCalledWith(mockUserId);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(response.json).toHaveBeenCalledWith(mockProfileData);
    });
  });
});
