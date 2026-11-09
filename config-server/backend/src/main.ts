/**
 * Point d'entrée principal de l'API Config Server (NestJS).
 * Ce fichier initialise le serveur HTTP, configure la sécurité CORS
 * et active la validation automatique des requêtes entrantes.
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // 1. Instanciation de l'application NestJS à partir du module racine
  const app = await NestFactory.create(AppModule);

  // 2. Configuration CORS (Cross-Origin Resource Sharing)
  // Permet aux applications clientes (Back Office Vite sur port 5173, etc.) d'appeler l'API
  app.enableCors({
    origin: /^http:\/\/localhost:\d+$/,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // 3. Validation globale des données entrantes (DTOs)
  // Rejette automatiquement les requêtes dont les champs sont invalides ou non autorisés
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime silencieusement les champs non déclarés dans les DTOs
      forbidNonWhitelisted: true, // Déclenche une erreur 400 Bad Request si un champ inconnu est envoyé
      transform: true, // Convertit automatiquement les charges utiles aux types attendus
    }),
  );

  // 4. Démarrage de l'écoute sur le port spécifié (port 3000 par défaut)
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port);
  console.log(`Serveur ODC Config démarré avec succès sur http://localhost:${port}`);
}

void bootstrap();

