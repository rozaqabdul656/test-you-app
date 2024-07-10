import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ProducerService } from './producer.service';
import amqp, { ChannelWrapper, AmqpConnectionManager } from 'amqp-connection-manager';
import { Channel } from 'amqplib';

jest.mock('amqp-connection-manager', () => {
  const originalModule = jest.requireActual('amqp-connection-manager');
  return {
    __esModule: true,
    default: {
      connect: jest.fn(),
    },
    ...originalModule,
  };
});

describe('ProducerService', () => {
  let service: ProducerService;
  let channelWrapperMock: jest.Mocked<ChannelWrapper>;
  let amqpConnectionManagerMock: jest.Mocked<AmqpConnectionManager>;

  beforeEach(async () => {
    channelWrapperMock = {
      sendToQueue: jest.fn(),
      addSetup: jest.fn(),
    } as unknown as jest.Mocked<ChannelWrapper>;

    amqpConnectionManagerMock = {
      createChannel: jest.fn().mockReturnValue(channelWrapperMock),
    } as unknown as jest.Mocked<AmqpConnectionManager>;

    // (amqp.connect as jest.Mock).mockReturnValue(amqpConnectionManagerMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProducerService],
    }).compile();

    service = module.get<ProducerService>(ProducerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('publish', () => {
    it('should publish a message to the queue successfully', async () => {
      const message = { content: 'test message' };
      channelWrapperMock.sendToQueue.mockResolvedValue(undefined);

      await service.publish(message);
    });
  });
});
