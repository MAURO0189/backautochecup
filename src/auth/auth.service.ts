import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { User } from './users/entities/user.entity';
import { MailService } from './mail/mail.service';
import e from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async getMe(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'username',
        'lastName',
        'email',
        'phoneNumber',
        'identificationNumber',
        'role',
      ],
    });
    return user;
  }

  // ── Paso 1: solicitar recuperación ──────────────────────────────
  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(
        `el correo ${email} no está registrado. Verifica y vuelve a intentarlo.`,
      );
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await this.userRepository.save(user);

    await this.mailService.sendPasswordResetEmail(email, token);
  }

  // ── Paso 2: aplicar la nueva contraseña ─────────────────────────
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: token },
    });

    if (!user || !user.resetPasswordExpires) {
      throw new NotFoundException('Token inválido o expirado.');
    }

    const isExpired = user.resetPasswordExpires < new Date();
    if (isExpired) {
      throw new BadRequestException(
        'El token ha expirado. Solicita uno nuevo.',
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);
  }
}
