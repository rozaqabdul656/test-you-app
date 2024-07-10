import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { JwtModule } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://rozaq:rozaq@cluster0-shard-00-00.eeeka.mongodb.net:27017,cluster0-shard-00-01.eeeka.mongodb.net:27017,cluster0-shard-00-02.eeeka.mongodb.net:27017/db_abdul_rozaq_betest?replicaSet=atlas-nm186a-shard-0&ssl=true&authSource=admin'),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
          secret: 'your_secret_key', // Replace this with your actual secret key
          signOptions: { expiresIn: '1h' }, // Token expiration time
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'testpassword',
      };
      const result = User; 
      const responseMock: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnValue(result),
      };
      jest.spyOn(service, 'register').mockResolvedValue(new result);
      
      expect(await controller.register(responseMock,registerDto)).toBe(result);
    });
  });
  describe('login', () => {
    it('should login', async () => {
      const loginDto: LoginDto = {
        email: 'testuser@example.com',
        password: 'testpassword',
      };
      const result = User; 
      const responseMock: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnValue(result),
      };
      jest.spyOn(service, 'Login').mockResolvedValue(new result);
      
      expect(await controller.login(responseMock,loginDto)).toBe(result);
    });
  });
});
