import { User, UserSchema } from './schemas/user.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

describe('AppModule', () => {
  let appModule: TestingModule;

  beforeAll(async () => {
    appModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
      imports: [
        MongooseModule.forRoot('mongodb://rozaq:rozaq@cluster0-shard-00-00.eeeka.mongodb.net:27017,cluster0-shard-00-01.eeeka.mongodb.net:27017,cluster0-shard-00-02.eeeka.mongodb.net:27017/db_abdul_rozaq_betest?replicaSet=atlas-nm186a-shard-0&ssl=true&authSource=admin'),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
          secret: 'your_secret_key', // Replace this with your actual secret key
          signOptions: { expiresIn: '1h' }, // Token expiration time
        }),
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(appModule).toBeDefined();
  });

  it('should have the AuthController', () => {
    const AuthControllers = appModule.get<AuthController>(AuthController);
    expect(AuthControllers).toBeDefined();
  });

  it('should have the AuthService', () => {
    const AuthServices = appModule.get<AuthService>(AuthService);
    expect(AuthServices).toBeDefined();
  });

  it('should have the JWT', () => {
    const JwtModules = appModule.get<JwtModule>(JwtModule);
    expect(JwtModules).toBeDefined();
  });
});
