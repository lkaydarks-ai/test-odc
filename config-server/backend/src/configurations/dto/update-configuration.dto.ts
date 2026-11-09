/**
 * DTO (Data Transfer Object) de validation pour la mise à jour partielle d'une configuration.
 * Reçu via PATCH /configurations/:key.
 * Remarque : le champ "key" n'est pas modifiable car il sert d'identifiant stable dans l'URL.
 */

import { IsEnum, IsObject, IsOptional } from 'class-validator';
import { ConfigStatus } from '../schemas/config.schema';

export class UpdateConfigurationDto {
  /**
   * Nouvelle valeur de la configuration (remplace l'objet JSON existant).
   */
  @IsOptional()
  @IsObject({ message: 'value doit être un objet JSON' })
  value?: Record<string, any>;

  /**
   * Nouveau statut d'activation ("active" ou "inactive").
   */
  @IsOptional()
  @IsEnum(ConfigStatus, { message: 'status doit être "active" ou "inactive"' })
  status?: ConfigStatus;
}
