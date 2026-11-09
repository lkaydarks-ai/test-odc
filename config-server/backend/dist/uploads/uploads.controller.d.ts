import type { Response } from 'express';
export declare class UploadsController {
    uploadFile(file: Express.Multer.File): {
        message: string;
        filename: string;
        url: string;
    };
    getFile(filename: string, res: Response): void;
}
