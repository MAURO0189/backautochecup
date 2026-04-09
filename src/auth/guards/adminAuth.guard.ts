import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly adminService: AdminService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException(
        'Token de autenticación no proporcionado',
      );
    }

    const admin = await this.adminService.validateToken(token);
    if (!admin) {
      throw new UnauthorizedException('Token de autenticación inválido');
    }

    request.admin = admin;
    return true;
  }
}
