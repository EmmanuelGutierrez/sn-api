import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { InjectModel } from '@nestjs/mongoose';
import { File } from './entities/file.entity';
import { Model } from 'mongoose';
import { fileType } from 'src/common/constants/cloudinary/fileTypes';
import pLimit from 'src/common/libs/limit';

@Injectable()
export class FileService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(File.name)
    private fileModel: Model<File>,
  ) {}

  async getAll() {
    const files = await this.fileModel.find();
    return files;
  }
  async create(
    fileData: Express.Multer.File,
    external_id: string,
    folder: string,
    type?: fileType,
  ) {
    const cloudinaryRes = await this.cloudinaryService.uploadFile(
      fileData,
      external_id,
      folder,
      type,
    );
    console.log(cloudinaryRes);
    const file: File = await this.fileModel.create({
      bytes: cloudinaryRes.bytes,
      public_id: cloudinaryRes.public_id,
      format: cloudinaryRes.format,
      original_filename: cloudinaryRes.original_filename,
      resource_type: cloudinaryRes.resource_type,
      secure_url: cloudinaryRes.secure_url,
      url: cloudinaryRes.url,
    });
    return file;
  }

  async createMany(
    filesData: Express.Multer.File[],
    external_id: string,
    folder: string,
    type?: fileType,
  ) {
    const limit = pLimit(5);
    const filesToUpload = filesData.map((file) => {
      return limit(async () => {
        const res = await this.create(file, external_id, folder, type);
        return res;
      });
    });

    const resProm = await Promise.allSettled(filesToUpload);
    return resProm;
    /*  const cloudinaryRes = await this.cloudinaryService.uploadFile(
      fileData,
      external_id,
      folder,
    );
    
    const file: File = await this.fileModel.create({
      bytes: cloudinaryRes.bytes,
      public_id: cloudinaryRes.public_id,
      format: cloudinaryRes.format,
      original_filename: cloudinaryRes.original_filename,
      resource_type: cloudinaryRes.resource_type,
      secure_url: cloudinaryRes.secure_url,
      url: cloudinaryRes.url,
    });
    return file; */
  }
}
