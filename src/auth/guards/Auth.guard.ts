import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.cookies?.access_token;

      if (!token) {
        throw new UnauthorizedException(
          'Token de autenticación no proporcionado',
        );
      }

      const user = await this.userService.validateToken(token);
      if (!user) {
        throw new UnauthorizedException('Token de autenticación inválido');
      }

      request.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Error al validar el token');
    }
  }
}
