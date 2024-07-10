import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMqModule } from './rabbitmq.module';
import { ProducerService } from './producer.service';

describe('RabbitMqModule', () => {
  let producerService: ProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RabbitMqModule],
    }).compile();

    producerService = module.get<ProducerService>(ProducerService);
  });

  it('should be defined', () => {
    expect(producerService).toBeDefined();
  });
});
