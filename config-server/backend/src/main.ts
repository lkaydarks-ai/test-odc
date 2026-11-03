// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3000);
// }
// void bootstrap();


import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS : autorise le frontend Vite (port 5173) à appeler l'API
  app.enableCors({
    // origin: 'http://localhost:5173',
    origin: /^http:\/\/localhost:\d+$/,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // Validation automatique des DTO sur toutes les routes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // supprime les champs non déclarés dans le DTO
      forbidNonWhitelisted: true, // renvoie une 400 si un champ inconnu est envoyé
      transform: true,
    }),
  );

  await app.listen(3000);
  console.log('API prête sur http://localhost:3000');
}
bootstrap();