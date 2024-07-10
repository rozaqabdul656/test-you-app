import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  images: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The name is required' })
  name: string;

  @ApiProperty({ enum: ['female', 'male'] })
  @IsNotEmpty({ message: 'The gender is required' })
  gender: string;

  @ApiProperty({ type: Date, default: '2023-07-24 00:00:00' })
  @IsNotEmpty({ message: 'The birthday is required' })
  birthday: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'The height is required' })
  height: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The weight is required' })
  weight: string;

  horoscope: string;

  zodiac: string;
}
