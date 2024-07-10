import {
  Body,
  Controller,
  UploadedFile,
  UseInterceptors,
  Req,
  Get,
  HttpStatus,
  Put,
  Post,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/profile.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from './../auth/auth.guard';
import {
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('api')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create Profile',
    type: ProfileDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Update Profile users',
  })
  @UseGuards(AuthGuard)
  @Post('createProfile')
  @UseInterceptors(
    FileInterceptor('images', {
      storage: diskStorage({
        destination: 'upload',
        filename: (req, file, cb) => {
          cb(null, Math.floor(Date.now() / 1000) + '-' + file.originalname);
        },
      }),
    }),
  )
  @ApiBearerAuth()
  async createProfile(
    @Req() req,
    @Res() response,
    @UploadedFile() file,
    @Body() profileDto: ProfileDto,
  ): Promise<string> {
    if (file) {
      profileDto.images = file.filename;
    }
    const resultZodiac = await this.detectionZodiacRender(profileDto.birthday);
    profileDto.horoscope = resultZodiac['horoscope'];
    profileDto.zodiac = resultZodiac['zodiac'];
    try {
      await this.profileService.save(profileDto, req.user.sub);
      return response.status(HttpStatus.CREATED).json({
        message: 'Succes',
        statusCode: 200,
      });
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('getProfile')
  @ApiResponse({
    status: 201,
    type: ProfileDto,
  })
  async getProfile(@Req() req, @Res() response) {
    try {
      const data = await this.profileService.findProfileById(req.user.sub);
      return response.status(HttpStatus.CREATED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update Profile', // Optional description
    type: ProfileDto, // Specify the type as form-data
  })
  @ApiResponse({
    status: 200,
    description: 'Update Profile users',
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('updateProfile')
  @UseInterceptors(
    FileInterceptor('images', {
      storage: diskStorage({
        destination: 'upload',
        filename: (req, file, cb) => {
          cb(null, Math.floor(Date.now() / 1000) + '-' + file.originalname);
        },
      }),
    }),
  )
  async updateProfile(
    @Req() req,
    @Res() response,
    @UploadedFile() file,
    @Body() profileDto: ProfileDto,
  ): Promise<string> {
    if (file) {
      profileDto.images = file.filename;
    }
    const resultZodiac = await this.detectionZodiacRender(profileDto.birthday);
    profileDto.horoscope = resultZodiac['horoscope'];
    profileDto.zodiac = resultZodiac['zodiac'];
    try {
      await this.profileService.update(req.user.sub, profileDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Succes',
        statusCode: 200,
      });
    } catch (error) {
      throw error;
    }
  }
  async detectionZodiacRender(birthdayDate: Date): Promise<Object> {
    birthdayDate = new Date(birthdayDate);
    const yearOnly = birthdayDate.getFullYear();
    const result = {
      zodiac: '',
      horoscope: '',
    };
    const ZodiacRender = {
      Aries: {
        start: new Date(yearOnly + '-03-21 00:00:00'),
        stop: new Date(yearOnly + '-04-19 23:59:59'),
        horoscope: 'Ram',
      },
      Taurus: {
        start: new Date(yearOnly + '-04-20 00:00:00'),
        stop: new Date(yearOnly + '-05-20 23:59:59'),
        horoscope: 'Bull',
      },
      Gemini: {
        start: new Date(yearOnly + '-05-21 00:00:00'),
        stop: new Date(yearOnly + '-06-21 23:59:59'),
        horoscope: 'Twins',
      },
      Cancer: {
        start: new Date(yearOnly + '-06-22 00:00:00'),
        stop: new Date(yearOnly + '-07-22 23:59:59'),
        horoscope: 'Crab',
      },
      Leo: {
        start: new Date(yearOnly + '-07-23 00:00:00'),
        stop: new Date(yearOnly + '-08-22 23:59:59'),
        horoscope: 'Lion',
      },
      Virgo: {
        start: new Date(yearOnly + '-08-23 00:00:00'),
        stop: new Date(yearOnly + '-09-22 23:59:59'),
        horoscope: 'Virgin',
      },
      Libra: {
        start: new Date(yearOnly + '-09-23 00:00:00'),
        stop: new Date(yearOnly + '-10-23 23:59:59'),
        horoscope: 'Balance',
      },
      Scorpius: {
        start: new Date(yearOnly + '-10-24 00:00:00'),
        stop: new Date(yearOnly + '-11-21 23:59:59'),
        horoscope: 'Scorpion',
      },
      Sagitarius: {
        start: new Date(yearOnly + '-11-22 00:00:00'),
        stop: new Date(yearOnly + '-12-21 23:59:59'),
        horoscope: 'Scorpion',
      },
      Capricornus: {
        start: new Date(yearOnly + '-12-22 00:00:00'),
        stop: new Date(yearOnly + 1 + '-01-19 23:59:59'),
        startPrev: new Date(yearOnly - 1 + '-12-22 00:00:00'),
        stopPrev: new Date(yearOnly + '-01-19 23:59:59'),
        horoscope: 'Goat',
      },
      Aquarius: {
        start: new Date(yearOnly + '-01-20 00:00:00'),
        stop: new Date(yearOnly + '-02-18 23:59:59'),
        horoscope: 'Water Bearer',
      },
      Pisces: {
        start: new Date(yearOnly + '-02-19 00:00:00'),
        stop: new Date(yearOnly + '-03-20 23:59:59'),
        horoscope: 'Fish',
      },
    };
    for (const key in ZodiacRender) {
      if (ZodiacRender.hasOwnProperty(key)) {
        const value = ZodiacRender[key];
        if (key == 'Capricornus') {
          if (
            (birthdayDate > value.start && birthdayDate < value.stop) ||
            (birthdayDate > value.startPrev && birthdayDate < value.stopPrev)
          ) {
            result.zodiac = key;
            result.horoscope = value.horoscope;
            break;
          }
        } else {
          if (birthdayDate > value.start && birthdayDate < value.stop) {
            result.zodiac = key;
            result.horoscope = value.horoscope;
            break;
          }
        }
      }
    }
    return result;
  }
}
