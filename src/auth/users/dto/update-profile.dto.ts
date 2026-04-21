import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsIn,
  IsOptional,
  ValidateIf,
  MinLength,
  MaxLength,
} from 'class-validator';

export const OCCUPATIONS = [
  'Empleado',
  'Independiente / Freelancer',
  'Empresario',
  'Estudiante',
  'Desempleado',
  'Pensionado / Jubilado',
  'Otros',
] as const;

export const HOW_DID_YOU_FIND_US_OPTIONS = [
  'Redes sociales',
  'Referido por un amigo',
  'Búsqueda en internet',
  'Publicidad',
  'Evento o feria',
  'Otros',
] as const;

export type OccupationType = (typeof OCCUPATIONS)[number];

export class UpdateProfileDto {
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  username!: string;

  @IsDateString({}, { message: 'La fecha de nacimiento no es válida' })
  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
  birthDate!: string;

  @IsIn(OCCUPATIONS, {
    message: `La ocupación debe ser una de las opciones disponibles`,
  })
  @IsNotEmpty({ message: 'La ocupación es obligatoria' })
  occupation!: OccupationType;

  @ValidateIf((o: UpdateProfileDto) => o.occupation === 'Otros')
  @IsOptional()
  @IsString({ message: 'La ocupación personalizada debe ser texto' })
  @IsNotEmpty({ message: 'Debes especificar tu ocupación' })
  @MaxLength(200, { message: 'La ocupación no puede exceder 200 caracteres' })
  otherOccupation?: string;

  @IsIn(HOW_DID_YOU_FIND_US_OPTIONS, {
    message: `Selecciona cómo nos conociste`,
  })
  @IsNotEmpty({ message: 'Este campo es obligatorio' })
  howDidYouFindUs!: string;
}
