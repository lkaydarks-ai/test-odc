/**
 * Contrôleur de gestion des médias (images du trombinoscope, avatars d'apprenants).
 * Fournit deux points d'accès :
 * 1. POST /uploads : Réceptionne un fichier image et le stocke sur le disque.
 * 2. GET /uploads/:filename : Distribue le fichier binaire au client (navigateur ou application Flutter).
 */

import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import type { Response } from 'express';

@Controller('uploads')
export class UploadsController {
  /**
   * Endpoint de téléversement d'image.
   * Utilise Multer (diskStorage) pour enregistrer le fichier dans le dossier local ./uploads.
   * Génère un nom de fichier unique basé sur le timestamp et un suffixe aléatoire pour éviter les collisions.
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (
          req: Express.Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) => {
          // Concatène un horodatage avec un nombre aléatoire pour assurer un nom de fichier unique
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname);
          callback(null, `${uniqueSuffix}${extension}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Détermine le port d'écoute actuel
    const port = process.env.PORT || '3000';
    // Construit l'URL publique de téléchargement pour le client Flutter ou React
    return {
      message: 'Image uploadée avec succès',
      filename: file.filename,
      url: `http://localhost:${port}/uploads/${file.filename}`,
    };
  }

  /**
   * Endpoint de récupération d'image statique.
   * Envoie le fichier binaire au client avec les en-têtes HTTP appropriés.
   */
  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    // Résout le chemin absolu du fichier dans le répertoire uploads du projet
    const cheminFichier = join(process.cwd(), 'uploads', filename);
    res.sendFile(cheminFichier);
  }
}
