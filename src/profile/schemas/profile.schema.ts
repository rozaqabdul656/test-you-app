import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
  @Prop({ required: false })
  images: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  birthday: Date;

  @Prop({ required: true })
  height: string;

  @Prop({ required: true })
  weight: string;

  @Prop({ required: true })
  horoscope: string;

  @Prop({ required: true })
  zodiac: string;

  @Prop({ required: true })
  userId: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
