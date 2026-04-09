import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class RegisterAdminDto {
  @IsString()
  @MinLength(7, {
    message: 'El nombre de administrador debe tener al menos 7 caracteres',
  })
  adminName!: string;

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
}
