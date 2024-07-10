import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'The username is required' })
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The email is required' })
  @IsEmail({}, { message: 'Incorrect email' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The password is required' })
  @MinLength(6)
  password: string;
}
