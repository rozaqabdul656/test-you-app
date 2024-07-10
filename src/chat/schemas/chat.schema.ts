import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ required: true })
  senderUserId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  receiveUserId: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
