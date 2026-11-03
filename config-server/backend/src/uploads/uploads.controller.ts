// src/uploads/uploads.controller.ts
import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import type { Response } from 'express';

@Controller('uploads')
export class UploadsController {
  
  // Route pour uploader une image (POST /uploads)
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      // On stocke les images dans un dossier "uploads" à la racine du backend
      destination: './uploads',
      // On génère un nom de fichier unique pour éviter les doublons
      filename: (
        req: Express.Request,
        file: Express.Multer.File,
        callback: (error: Error | null, filename: string) => void,
      ) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${uniqueSuffix}${ext}`);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // On renvoie l'URL de l'image pour que Flutter puisse l'afficher
    return {
      message: 'Image uploadée avec succès',
      url: `http://localhost:3000/uploads/${file.filename}`,
    };
  }

  // Route pour récupérer une image par son nom (GET /uploads/:filename)
  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    // On renvoie le fichier physique depuis le dossier "uploads"
    res.sendFile(join(process.cwd(), 'uploads', filename));
  }
}