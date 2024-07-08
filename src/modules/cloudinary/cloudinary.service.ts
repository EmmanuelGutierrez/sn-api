import { Injectable } from '@nestjs/common';
import { CloudinaryResponse } from 'src/common/models/cloudinary/CloudinaryResponse.model';
import { v2 as cloudinary } from 'cloudinary';
import { Readable, Stream } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File, folder?: string) {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image', public_id: '' },
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        },
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}
