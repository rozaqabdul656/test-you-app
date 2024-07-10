import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatService } from './chat.service';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { ChatDto } from './dto/chat.dto';

describe('ChatService', () => {
  let chatService: ChatService;
  let chatModel: Model<ChatDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getModelToken(Chat.name),
          useValue: {
            new: jest.fn().mockResolvedValue({}),
            constructor: jest.fn().mockResolvedValue({}),
            find: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    chatService = module.get<ChatService>(ChatService);
    chatModel = module.get<Model<ChatDocument>>(getModelToken(Chat.name));
  });

  it('should be defined', () => {
    expect(chatService).toBeDefined();
  });

  describe('save', () => {
    it('should save a chat message successfully', async () => {
      const chatDto: ChatDto = { senderUserId: '123', receiveUserId: '456', message: 'Hello', createdAt: new Date() };
      const savedChat = { ...chatDto, createdAt: new Date() };
      jest.spyOn(chatService, 'save').mockResolvedValue(chatDto);
      const result = await chatService.save(chatDto);

      expect(result).toEqual(savedChat);
    });
  });

  describe('findMessage', () => {
    it('should find messages successfully', async () => {
      const fromUserId = '123';
      const userId = '456';
      const messages = [{ senderUserId: fromUserId, receiveUserId: userId, content: 'Hello' }];
      jest.spyOn(chatModel, 'find').mockResolvedValue(messages);

      const result = await chatService.findMessage(fromUserId, userId);

      expect(result).toEqual(messages);
      expect(chatModel.find).toHaveBeenCalledWith({ senderUserId: fromUserId, receiveUserId: userId });
    });
  });
});
