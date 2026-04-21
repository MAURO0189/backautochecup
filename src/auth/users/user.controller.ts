import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Res,
  UseGuards,
  Patch,
  StreamableFile,
} from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import type { Response } from 'express';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UploadAvatarDto } from './dto/upload-avatar.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Throttle({ short: { ttl: 60000, limit: 3 } })
  async register(@Body() registerDto: RegisterDto) {
    try {
      await this.userService.register(registerDto);
      return { message: 'Usuario registrado exitosamente' };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`Error al registrar usuario: ${errorMessage}`);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: errorMessage,
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Post('login')
  @Throttle({ login: { ttl: 900000, limit: 3 } })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.userService.login(loginDto);

      // Setear el JWT en una cookie HttpOnly
      res.cookie('access_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24,
      });
      return {
        message: 'Login exitoso',
        email: result.email,
        role: result.role,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`Error al iniciar sesión: ${errorMessage}`);
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: errorMessage,
        },
        HttpStatus.UNAUTHORIZED,
        { cause: error },
      );
    }
  }

  @Patch('profile/:uuid')
  @UseGuards(JwtAuthGuard)
  @SkipThrottle()
  async updateProfile(
    @Param('uuid') uuid: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    try {
      return await this.userService.updateProfile(uuid, updateProfileDto);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: errorMessage },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Patch('avatar/:uuid')
  @UseGuards(JwtAuthGuard)
  @SkipThrottle()
  async updateAvatar(
    @Param('uuid') uuid: string,
    @Body() uploadAvatarDto: UploadAvatarDto,
  ) {
    try {
      return await this.userService.updateAvatar(uuid, uploadAvatarDto);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: errorMessage },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Get('avatar/:uuid')
  @SkipThrottle()
  async getAvatar(
    @Param('uuid') uuid: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const avatar = await this.userService.getAvatar(uuid);

    if (!avatar) {
      throw new HttpException('Avatar no encontrado', HttpStatus.NOT_FOUND);
    }

    res.set({
      'Content-Type': avatar.mimeType,
      'Content-Length': avatar.data.byteLength,
      'Cache-Control': 'public, max-age=86400', // cache 1 día
    });

    return new StreamableFile(avatar.data);
  }

  @Post('logout')
  @SkipThrottle()
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logout exitoso' };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
