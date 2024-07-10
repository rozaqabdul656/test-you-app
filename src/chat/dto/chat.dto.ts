import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatDto {

  @ApiProperty()
  @IsNotEmpty({ message: 'sender receiveUserId is required' })
  receiveUserId: string;

  @ApiProperty()
  // @IsNotEmpty({ message: 'sender userId is required' })
  senderUserId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'message is required' })
  message: string;

  @ApiProperty()
  // @IsNotEmpty({ message: 'The createdAt is required' })
  createdAt: Date;
}
