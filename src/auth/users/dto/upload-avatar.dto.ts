// src/modules/user/dto/upload-avatar.dto.ts
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class UploadAvatarDto {
  // Base64 puro — sin el prefijo "data:image/..."
  @IsString()
  @IsNotEmpty({ message: 'La imagen es obligatoria' })
  imageBase64!: string;

  @IsString()
  @Matches(/^image\/(jpeg|png|webp|gif|jpg)$/, {
    message: 'Formato de imagen no permitido',
  })
  mimeType!: string;
}
