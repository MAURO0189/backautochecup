import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { User } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { EmailValidator } from '../../common/validators/email.validator';
import { ValidatePassword } from '../../common/validators/validate.password';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register({
    username,
    lastName,
    email,
    password,
    phoneNumber,
    identificationNumber,
  }: RegisterDto) {
    if (EmailValidator.validate(email).length) {
      throw new BadRequestException('El correo electrónico no es válido');
    }

    if (ValidatePassword.validate(password).length) {
      throw new BadRequestException(
        'La contraseña no cumple con los requisitos de seguridad',
      );
    }

    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new BadRequestException('El usuario ya está registrado');
    }

    const uuid = uuidv4();

    const hashedPassword = await bcryptjs.hash(password, 12);

    const newUser = this.userRepository.create({
      username,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      identificationNumber,
      uuid: uuid,
    });

    this.mailService
      .sendWelcomeEmail(newUser.email, newUser.username)
      .catch(() => {});

    return this.userRepository.save(newUser);
  }

  async login({ email, password }: LoginDto) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payLoad = {
      email: user.email,
      role: user.role,
      uuid: user.uuid,
      sub: user.id,
      type: 'user' as const,
      iat: Math.floor(Date.now() / 1000),
    };

    const token = await this.jwtService.signAsync(payLoad);

    return {
      token,
      email: user.email,
      role: user.role,
    };
  }

  async validateToken(token: string) {
    try {
      const decodedToken = await this.jwtService.verifyAsync(token);

      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
        throw new UnauthorizedException('Token expirado');
      }

      const userExist = await this.userRepository.findOne({
        where: { uuid: decodedToken.uuid },
      });

      if (!userExist) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      return userExist;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new UnauthorizedException('Token inválido: ' + errorMessage);
    }
  }

  create(createUserDto: RegisterDto) {
    return this.userRepository.create(createUserDto);
  }

  async findAll(): Promise<
    { id: number; username: string; lastName: string; email: string }[]
  > {
    const users = await this.userRepository.find({
      select: ['id', 'username', 'lastName', 'email'],
    });
    return users.map((user) => ({
      id: user.id,
      username: user.username,
      lastName: user.lastName,
      email: user.email,
    }));
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<string> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException('Usuario no encontrado');
    }
    return 'Usuario eliminado exitosamente';
  }
}
