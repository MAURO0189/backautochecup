import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  MinLength,
  Matches,
  IsNumberString,
  Length,
} from 'class-validator';
import { Match } from '../../../common/validators/match.decorators';

export class RegisterDto {
  @IsString()
  @MinLength(4, {
    message: 'El nombre de usuario debe tener al menos 5 caracteres',
  })
  username!: string;

  @IsString()
  @MinLength(5, { message: 'El apellido debe tener al menos 5 caracteres' })
  lastName!: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email!: string;

  @IsString()
  @MinLength(8, {
    message:
      'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>,.?~\\/-]{8,}$/,
    {
      message:
        'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial',
    },
  )
  password!: string;

  @IsPhoneNumber('CO', {
    message:
      'El número de teléfono no es válido o no corresponde a un número de Colombia',
  })
  phoneNumber!: string;

  @IsNumberString()
  @Length(6, 10, {
    message: 'El número de identificación debe tener entre 6 y 10 caracteres',
  })
  identificationNumber!: string;
}
