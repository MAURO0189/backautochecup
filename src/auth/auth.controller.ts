import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard, Roles } from './guards/jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  @Get('csrf-token')
  getCsrfToken(@Req() req: Request) {
    return { csrfToken: req.csrfToken() };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @Roles('user', 'admin')
  getMe(@Req() req: any) {
    // El guard ya verificó el token — solo retornar el payload
    return {
      id: req.user.sub,
      email: req.user.email,
      role: req.user.role,
      type: req.user.type,
    };
  }
}
