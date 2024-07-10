import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;
  constructor() {
    const connection = amqp.connect(['amqp://localhost:5672']);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('message', { durable: true });
      },
    });
  }

  async publish(message: any) {
    try {
      await this.channelWrapper.sendToQueue(
        'message',
        Buffer.from(JSON.stringify(message))
      );
    } catch (error) {
      throw new HttpException(
        'Error send message to queue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}