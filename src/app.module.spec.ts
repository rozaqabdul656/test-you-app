import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { MulterModule } from '@nestjs/platform-express';
import { JwtModule } from '@nestjs/jwt';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb://rozaq:rozaq@cluster0-shard-00-00.eeeka.mongodb.net:27017,cluster0-shard-00-01.eeeka.mongodb.net:27017,cluster0-shard-00-02.eeeka.mongodb.net:27017/db_abdul_rozaq_betest?replicaSet=atlas-nm186a-shard-0&ssl=true&authSource=admin',
          { dbName: 'db_abdul_rozaq_betest' },
        ),
        AuthModule,
        ProfileModule,
        MulterModule.register({
          dest: './uploads', // Destination folder for uploaded files
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should import the AuthModule', () => {
    const authModule = module.select(AuthModule);
    expect(authModule).toBeDefined();
  });

  it('should import the ProfileModule', () => {
    const profileModule = module.select(ProfileModule);
    expect(profileModule).toBeDefined();
  });

  it('should provide the AppController', () => {
    const controller = module.get<AppController>(AppController);
    expect(controller).toBeDefined();
  });

  it('should provide the AppService', () => {
    const service = module.get<AppService>(AppService);
    expect(service).toBeDefined();
  });
});
