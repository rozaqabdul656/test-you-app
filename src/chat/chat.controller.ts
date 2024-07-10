import {
  Body,
  Controller,
  UploadedFile,
  UseInterceptors,
  Req,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ProducerService } from '../rabbitmq/producer.service';
import { ChatDto } from './dto/chat.dto';
import { AuthGuard } from './../auth/auth.guard';
import {
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';


@Controller('api')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly producerService: ProducerService
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Send Message Success',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('sendMessage')
  async sendMessage(
    @Req() req,
    @Res() response,
    @UploadedFile() file,
    @Body() ChatDto: ChatDto,
  ): Promise<string> {
    try {
      ChatDto.senderUserId = req.user.sub;
      let message = ChatDto;
      await this.chatService.save(ChatDto);

      this.producerService.publish(message);
      return response.status(HttpStatus.CREATED).json({
        message: 'Succes',
        statusCode: 200,
      });
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: 200,
    description: 'Get Message Success',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('viewMessages/:id')
  async viewMessages(@Req() req, @Res() response, @Param('id') userId: string) {
    try {
      const data = await this.chatService.findMessage(userId, req.user.sub);
      return response.status(HttpStatus.OK).json({
        message: 'Succes',
        data: data,
        statusCode: 200
      });
    } catch (error) {
      throw error;
    }
  }
}
