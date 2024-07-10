import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { ChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
  ) {}

  async save(chatDto: ChatDto): Promise<Chat> {
    return await new this.chatModel({
      ...chatDto,
      createdAt: new Date(),
    }).save();
  }

  async findMessage(fromUserId: string, userId: string) {
    return await this.chatModel.find({ senderUserId: fromUserId, receiveUserId: userId });
  }
}
