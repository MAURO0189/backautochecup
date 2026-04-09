import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { RegisterAdminDto } from './dto/registerAdmin.dto';
import * as bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { LoginAdminDto } from './dto/loginAdmin.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailValidator } from '../../common/validators/email.validator';
import { ValidatePassword } from '../../common/validators/validate.password';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async registerAdmin({ adminName, email, password }: RegisterAdminDto) {
    if (EmailValidator.validate(email).length) {
      throw new BadRequestException('El correo electrónico no es válido');
    }

    if (ValidatePassword.validate(password).length) {
      throw new BadRequestException(
        'La contraseña no cumple con los requisitos de seguridad',
      );
    }

    const existingAdmin = await this.adminRepository.findOneBy({ email });
    if (existingAdmin) {
      throw new BadRequestException('El administrador ya está registrado');
    }

    const uuid = uuidv4();

    const hashedPassword = await bcryptjs.hash(password, 12);

    const newAdmin = this.adminRepository.create({
      adminName,
      email,
      password: hashedPassword,
      uuid,
    });
    return await this.adminRepository.save(newAdmin);
  }

  async loginAdmin({ email, password }: LoginAdminDto) {
    const admin = await this.adminRepository.findOneBy({ email });
    if (!admin) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcryptjs.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: admin.id,
      uuid: admin.uuid,
      email: admin.email,
      role: admin.role,
      type: 'admin' as const,
    };

    const token = await this.jwtService.signAsync(payload);

    return { token, email: admin.email, role: admin.role };
  }

  async validateToken(token: string) {
    try {
      const decodedToken = await this.jwtService.verifyAsync(token);
      const admin = await this.adminRepository.findOneBy({
        id: decodedToken.sub,
      });

      if (!admin)
        throw new UnauthorizedException('Administrador no encontrado');
      return admin;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  create(createAdminDto: RegisterAdminDto) {
    return this.adminRepository.create(createAdminDto);
  }

  async findAll(): Promise<{ id: number; adminName: string; email: string }[]> {
    const admins = await this.adminRepository.find();
    return admins.map((admin) => ({
      id: admin.id,
      adminName: admin.adminName,
      email: admin.email,
    }));
  }

  findOne(id: number) {
    return this.adminRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<string> {
    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) {
      throw new BadRequestException('Administrador no encontrado');
    }
    await this.adminRepository.remove(admin);
    return 'Administrador eliminado exitosamente';
  }
}
