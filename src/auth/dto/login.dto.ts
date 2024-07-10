import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'The Username or Email is required' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The password is required' })
  @MinLength(6)
  password: string;
}
