import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ProducerService } from '../rabbitmq/producer.service';
import { AuthGuard } from './../auth/auth.guard';
import { HttpStatus } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';

describe('ChatController', () => {
  let chatController: ChatController;
  let chatService: ChatService;
  let producerService: ProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: {
            save: jest.fn(),
            findMessage: jest.fn(),
          },
        },
        {
          provide: ProducerService,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    chatController = module.get<ChatController>(ChatController);
    chatService = module.get<ChatService>(ChatService);
    producerService = module.get<ProducerService>(ProducerService);
  });

  describe('sendMessage', () => {
    it('should send a message successfully', async () => {
      const req = { user: { sub: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const chatDto: ChatDto = { senderUserId: '', message: 'Hello', receiveUserId: '', createdAt: new Date() };
      jest.spyOn(chatService, 'save').mockResolvedValue(chatDto);
      jest.spyOn(producerService, 'publish').mockResolvedValue(undefined);

      await chatController.sendMessage(req, res, undefined, chatDto);

      expect(chatService.save).toHaveBeenCalledWith(chatDto);
      expect(producerService.publish).toHaveBeenCalledWith(chatDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Succes',
        statusCode: 200,
      });
    });

    it('should handle errors', async () => {
      const req = { user: { sub: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const chatDto: ChatDto = { senderUserId: '', message: 'Hello', receiveUserId: '', createdAt: new Date() };
      const error = new Error('Something went wrong');
      jest.spyOn(chatService, 'save').mockRejectedValue(error);

      await expect(
        chatController.sendMessage(req, res, undefined, chatDto),
      ).rejects.toThrow(error);
    });
  });

  describe('viewMessages', () => {
    it('should get messages successfully', async () => {
      const req = { user: { sub: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };


      const messages = [{ senderUserId: '123', message: 'Hello', receiveUserId: '', createdAt: new Date() }] as any;
      jest.spyOn(chatService, 'findMessage').mockResolvedValue(messages);

      await chatController.viewMessages(req, res, '123');

      expect(chatService.findMessage).toHaveBeenCalledWith('123', '123');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Succes',
        data: messages,
        statusCode: 200,
      });
    });

    it('should handle errors', async () => {
      const req = { user: { sub: '123' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const error = new Error('Something went wrong');
      jest.spyOn(chatService, 'findMessage').mockRejectedValue(error);

      await expect(
        chatController.viewMessages(req, res, '123'),
      ).rejects.toThrow(error);
    });
  });
});
