import { IsEnum, IsObject, IsOptional } from 'class-validator';
import { ConfigStatus } from '../schemas/config.schema';

// La clé n'est pas modifiable : elle sert d'identifiant dans l'URL
export class UpdateConfigurationDto {
  @IsOptional()
  @IsObject({ message: 'value doit être un objet JSON' })
  value?: Record<string, any>;

  @IsOptional()
  @IsEnum(ConfigStatus, { message: 'status doit être "active" ou "inactive"' })
  status?: ConfigStatus;
}