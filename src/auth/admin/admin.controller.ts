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
} from '@nestjs/common';
import type { Response } from 'express';
import { AdminService } from './admin.service';
import { RegisterAdminDto } from './dto/registerAdmin.dto';
import { LoginAdminDto } from './dto/loginAdmin.dto';

@Controller('api/admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  async register(@Body() registerAdminDto: RegisterAdminDto) {
    try {
      await this.adminService.registerAdmin(registerAdminDto);
      return { message: 'Administrador registrado exitosamente' };
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

  @Post('login')
  async login(
    @Body() loginAdminDto: LoginAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.adminService.loginAdmin(loginAdminDto);

      res.cookie('access_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 8,
      });

      return {
        message: 'Login exitoso',
        email: result.email,
        role: result.role,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new HttpException(
        { status: HttpStatus.UNAUTHORIZED, error: errorMessage },
        HttpStatus.UNAUTHORIZED,
        { cause: error },
      );
    }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Sesión cerrada exitosamente' };
  }

  @Get()
  async findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.adminService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const result = await this.adminService.remove(id);
      return { message: result };
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
}
