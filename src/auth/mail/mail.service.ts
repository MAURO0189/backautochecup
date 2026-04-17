import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  // ✅ Correo de bienvenida — nuevo
  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"AutocheckUp" <${process.env.MAIL_USER}>`,
        to: email,
        subject: '¡Bienvenido a AutocheckUp!',
        html: `
          <h2>¡Hola, ${username}!</h2>
          <p>Tu registro fue exitoso. Ya puedes iniciar sesión.</p>
          <a href="${process.env.FRONTEND_URL}/login" style="
            display:inline-block;
            padding:10px 20px;
            background:#65a30d;
            color:#fff;
            border-radius:6px;
            text-decoration:none;
            font-weight:600;
          ">Iniciar sesión</a>
          <p>Si no creaste esta cuenta, ignora este correo.</p>
        `,
      });
    } catch (error) {
      // No lanzamos excepción — el registro ya fue exitoso
      // Un fallo en el correo no debe bloquear el flujo
      this.logger.error('Error enviando correo de bienvenida', error);
    }
  }

  // ✅ Correo de recuperación — sin cambios
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: `"Tu App" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Recuperar contraseña',
        html: `
          <h2>Recupera tu contraseña</h2>
          <p>Haz clic en el siguiente enlace para restablecer tu contraseña.</p>
          <p>El enlace expira en <strong>15 minutos</strong>.</p>
          <a href="${resetUrl}" style="
            display:inline-block;
            padding:10px 20px;
            background:#65a30d;
            color:#fff;
            border-radius:6px;
            text-decoration:none;
            font-weight:600;
          ">Restablecer contraseña</a>
          <p>Si no solicitaste esto, ignora este correo.</p>
        `,
      });
    } catch (error) {
      this.logger.error('Error enviando correo de recuperación', error);
      throw new InternalServerErrorException('No se pudo enviar el correo.');
    }
  }
}
