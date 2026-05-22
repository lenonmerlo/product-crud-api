import { v2 as cloudinary } from 'cloudinary';
import { StorageEngine } from 'multer';
import { Request } from 'express';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryStorage: StorageEngine = {
  _handleFile(
    _req: Request,
    file: Express.Multer.File,
    cb: (error?: Error | null, info?: Partial<Express.Multer.File>) => void,
  ) {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'product-crud',
        transformation: [{ width: 800, height: 800, crop: 'limit' }],
      },
      (error, result) => {
        if (error) return cb(error);
        cb(null, { path: result?.secure_url, size: result?.bytes });
      },
    );
    file.stream.pipe(uploadStream);
  },

  _removeFile(
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null) => void,
  ) {
    cb(null);
  },
};
