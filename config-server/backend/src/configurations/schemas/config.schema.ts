import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export enum ConfigStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// timestamps: true => Mongoose gère createdAt et updatedAt automatiquement
@Schema({ timestamps: true })
export class Config {
  // Clé unique, ex: "programs.devops"
  @Prop({ required: true, unique: true, trim: true })
  key: string;

  // Le JSON de configuration (n'importe quelle structure d'objet)
  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  value: Record<string, any>;

  @Prop({ type: String, enum: ConfigStatus, default: ConfigStatus.ACTIVE })
  status: ConfigStatus;

  // Remplis automatiquement par "timestamps: true" (pas de @Prop nécessaire)
  createdAt?: Date;
  updatedAt?: Date;
}

export type ConfigDocument = HydratedDocument<Config>;
export const ConfigSchema = SchemaFactory.createForClass(Config);