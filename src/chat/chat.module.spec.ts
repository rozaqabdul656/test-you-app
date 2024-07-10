import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { AuthModule } from '../auth/auth.module';
import { RabbitMqModule } from './../rabbitmq/rabbitmq.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('ChatModule', () => {
  let module: TestingModule;
  let chatController: ChatController;
  let chatService: ChatService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://rozaq:rozaq@cluster0-shard-00-00.eeeka.mongodb.net:27017,cluster0-shard-00-01.eeeka.mongodb.net:27017,cluster0-shard-00-02.eeeka.mongodb.net:27017/db_abdul_rozaq_betest?replicaSet=atlas-nm186a-shard-0&ssl=true&authSource=admin'),
        MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
        AuthModule,
        RabbitMqModule,
      ],
      controllers: [ChatController],
      providers: [ChatService],
    })
      .overrideProvider(getModelToken(Chat.name))
      .useValue({
        new: jest.fn().mockResolvedValue({}),
        constructor: jest.fn().mockResolvedValue({}),
        find: jest.fn(),
        create: jest.fn(),
      })
      .compile();

    chatController = module.get<ChatController>(ChatController);
    chatService = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have the ChatController', () => {
    const chatController = module.get<ChatController>(ChatController);
    expect(chatController).toBeDefined();
  });
});
