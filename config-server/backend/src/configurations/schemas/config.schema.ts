/**
 * Modèle de données Mongoose pour la collection "configs".
 * Stocke les clés de configuration, leurs valeurs JSON dynamiques
 * et leurs métadonnées temporelles.
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

/**
 * Énumération des statuts d'une configuration.
 * - active : La configuration est prise en compte par les applications clientes.
 * - inactive : La configuration est temporairement désactivée.
 */
export enum ConfigStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true }) // Génère automatiquement les champs createdAt et updatedAt
export class Config {
  /**
   * Clé unique et indexée identifiant la configuration (ex: "app.services", "app.user_avatar").
   */
  @Prop({ required: true, unique: true, trim: true })
  key: string;

  /**
   * Objet JSON polymorphe contenant la charge utile de configuration.
   * Le type Mixed permet de stocker n'importe quelle structure JSON valide.
   */
  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  value: Record<string, any>;

  /**
   * Statut de la configuration ("active" ou "inactive").
   */
  @Prop({ type: String, enum: ConfigStatus, default: ConfigStatus.ACTIVE })
  status: ConfigStatus;

  // Propriétés gérées automatiquement par Mongoose timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

export type ConfigDocument = HydratedDocument<Config>;
export const ConfigSchema = SchemaFactory.createForClass(Config);
