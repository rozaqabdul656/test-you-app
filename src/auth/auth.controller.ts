import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiBody } from '@nestjs/swagger';

@Controller('api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiBody({ type: [RegisterDto] })
  @Post('register')
  async register(@Res() response, @Body() registerDto: RegisterDto) {
    const existingEmail = await this.authService.findByEmailUsername(
      registerDto.email,
      registerDto.username,
    );
    if (existingEmail) {
      throw new ConflictException('Email or Username already exists');
    }
    try {
      await this.authService.register(registerDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Succes',
        statusCode: 200,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: User not created!',
        ...error,
      });
    }
  }

  @ApiBody({ type: [LoginDto] })
  @Post('login')
  async login(@Res() response, @Body() loginDto: LoginDto) {
    try {
      const ResultLogin = await this.authService.Login(loginDto);
      if (ResultLogin) {
        const payload = {
          username: ResultLogin['username'],
          sub: ResultLogin['_id'],
          email: ResultLogin['email'],
        };
        const LoginResponse = {
          id_user: ResultLogin['_id'],
          username: ResultLogin['username'],
          email: ResultLogin['email'],
          access_token: this.jwtService.sign(payload),
        };
        return response.status(HttpStatus.OK).json({
          message: 'Succes',
          ...LoginResponse,
          statusCode: 200,
        });
      }
    } catch (error) {
      throw error;
    }
  }
}
