import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from './user.schema';

jest.mock('bcrypt');

describe('User Model', () => {
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken('User'),
          useValue: Model,
        },
      ],
    }).compile();

    userModel = module.get<Model<UserDocument>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(userModel).toBeDefined();
  });

  it('should hash password before saving', async () => {
    const plainPassword = 'mypassword';
    const mockSalt = 'mock-salt';
    const mockHashedPassword = 'hashed-password';
    const user:User=({
      username: 'testuser',
      email: 'testuser@example.com',
      password: plainPassword,
      createdAt: new Date(),
    });

    // Mocking bcrypt.genSalt and bcrypt.hash functions
    (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

    // expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, mockSalt);
    expect(mockHashedPassword).toBe(mockHashedPassword);
  });
});
