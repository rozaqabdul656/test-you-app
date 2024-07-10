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
      exports: [AuthService, JwtModule]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const RegisterDto: RegisterDto = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'testpassword',
      };
  
      const createdPost : User = {
        username: RegisterDto.username,
        email: RegisterDto.email,
        password: RegisterDto.password,
        createdAt:new Date()
      };
  
      jest.spyOn(service, 'register').mockResolvedValue(createdPost);
  
      const result = await service.register(RegisterDto);
  
      expect(result).toEqual(createdPost);
      expect(service.register).toHaveBeenCalledWith(RegisterDto);
    });

    it('should login', async () => {
      const LoginDto: LoginDto = {
        email: 'testuser@example.com',
        password: 'testpassword',
      };
  
      const createdPost : User = {
        username: 'username',
        email: LoginDto.email,
        password: LoginDto.password,
        createdAt:new Date()
      };
  
      jest.spyOn(service, 'Login').mockResolvedValue(createdPost);
  
      const result = await service.Login(LoginDto);
  
      expect(result).toEqual(createdPost);
      expect(service.Login).toHaveBeenCalledWith(LoginDto);
    });
  });
});
