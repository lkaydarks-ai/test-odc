/**
 * DTO (Data Transfer Object) de validation pour la création d'une configuration.
 * Définit et contrôle les règles de structure des données reçues via POST /configurations.
 */

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
  /**
   * Clé unique d'identification de la configuration (ex: "app.services", "programs.devops").
   * Ne doit comporter que des caractères alphanumériques, points, tirets ou underscores.
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9._-]+$/, {
    message:
      'La clé ne peut contenir que des lettres, chiffres, points, tirets et underscores',
  })
  key: string;

  /**
   * Contenu JSON de la configuration.
   * Doit obligatoirement être un objet JSON valide (pas un scalaire ni une chaîne simple).
   */
  @IsObject({ message: 'value doit être un objet JSON' })
  value: Record<string, any>;

  /**
   * Statut d'activation de la configuration ("active" ou "inactive").
   * Facultatif à la création : prend la valeur "active" par défaut si non renseigné.
   */
  @IsOptional()
  @IsEnum(ConfigStatus, { message: 'status doit être "active" ou "inactive"' })
  status?: ConfigStatus;
}
