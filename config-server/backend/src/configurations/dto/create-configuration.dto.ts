import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ConfigStatus } from '../schemas/config.schema';

export class CreateConfigurationDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9._-]+$/, {
    message:
      'La clé ne peut contenir que des lettres, chiffres, points, tirets et underscores',
  })
  key: string;

  // Doit être un objet JSON (pas un tableau, pas une string)
  @IsObject({ message: 'value doit être un objet JSON' })
  value: Record<string, any>;

  @IsOptional()
  @IsEnum(ConfigStatus, { message: 'status doit être "active" ou "inactive"' })
  status?: ConfigStatus;
}