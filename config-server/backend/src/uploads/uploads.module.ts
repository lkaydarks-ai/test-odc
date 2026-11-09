/**
 * Module NestJS responsable de l'exposition du contrôleur d'uploads de médias.
 */

import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';

@Module({
  controllers: [UploadsController],
})
export class UploadsModule {}

