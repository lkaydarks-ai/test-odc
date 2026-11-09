/**
 * Module racine de l'application NestJS.
 * Il orchestre la connexion à la base de données MongoDB et enregistre
 * les modules métiers : Configurations (gestion des clés/valeurs) et Uploads (gestion des fichiers médias).
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationsModule } from './configurations/configurations.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    // Connexion à MongoDB : utilise la variable d'environnement MONGODB_URI si disponible,
    // sinon se connecte à l'instance MongoDB locale par défaut sur le port 27017.
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/config-server',
    ),

    // Module responsable du stockage et de la distribution des configurations dynamiques
    ConfigurationsModule,

    // Module responsable de la réception et du service des fichiers médias (photos de profil, bannières)
    UploadsModule,
  ],
})
export class AppModule {}
