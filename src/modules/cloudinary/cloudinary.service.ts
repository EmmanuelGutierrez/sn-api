import { Injectable } from '@nestjs/common';
import { CloudinaryResponse } from 'src/common/models/cloudinary/CloudinaryResponse.model';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { fileType } from 'src/common/constants/cloudinary/fileTypes';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    external_id: string,
    folder?: string,
    resource_type?: fileType,
  ) {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type, public_id: external_id, folder },
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
