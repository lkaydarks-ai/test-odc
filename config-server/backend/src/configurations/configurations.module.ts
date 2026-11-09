/**
 * Module NestJS regroupant les composants de gestion des configurations.
 * Lie le schéma Mongoose (ConfigSchema), le contrôleur HTTP (ConfigurationsController)
 * et le service métier (ConfigurationsService).
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationsController } from './configurations.controller';
import { ConfigurationsService } from './configurations.service';
import { Config, ConfigSchema } from './schemas/config.schema';

@Module({
  imports: [
    // Déclaration du schéma Mongoose pour injection dans ConfigurationsService
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
  ],
  controllers: [ConfigurationsController],
  providers: [ConfigurationsService],
})
export class ConfigurationsModule {}
