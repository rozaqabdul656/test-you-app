import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileModule } from './profile.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { AuthModule } from './../auth/auth.module';

describe('ProfileModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb://rozaq:rozaq@cluster0-shard-00-00.eeeka.mongodb.net:27017,cluster0-shard-00-01.eeeka.mongodb.net:27017,cluster0-shard-00-02.eeeka.mongodb.net:27017/db_abdul_rozaq_betest?replicaSet=atlas-nm186a-shard-0&ssl=true&authSource=admin',
        ),
        MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
        AuthModule,
        ProfileModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should import the ProfileController', () => {
    const controller = module.get<ProfileController>(ProfileController);
    expect(controller).toBeDefined();
  });

  it('should import the ProfileService', () => {
    const service = module.get<ProfileService>(ProfileService);
    expect(service).toBeDefined();
  });

  it('should import the MongooseModule', () => {
    const mongooseModule = module.get(MongooseModule);
    expect(mongooseModule).toBeDefined();
  });

  it('should import the AuthModule', () => {
    const authModule = module.select(AuthModule);
    expect(authModule).toBeDefined();
  });
});
