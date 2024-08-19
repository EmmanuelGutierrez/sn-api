import { v2 } from 'cloudinary';
import { Inject, Injectable } from '@nestjs/common';
import { config } from '../../common/config/config';
import { ConfigType } from '@nestjs/config';
// import { CLOUDINARY } from 'src/common/constants/constants';

@Injectable()
export class CloudinaryProvider {
  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {
    v2.config({
      cloud_name: this.configService.cloudinary.CLOUDINARY_CLOUD_NAME,
      api_key: this.configService.cloudinary.CLOUDINARY_API_KEY,
      api_secret: this.configService.cloudinary.CLOUDINARY_API_SECRET,
    });
  }
}

/* export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (configService: ConfigType<typeof config>) => {
    return v2.config({
      cloud_name: configService.cloudinary.CLOUDINARY_CLOUD_NAME,
      api_key: configService.cloudinary.CLOUDINARY_API_KEY,
      api_secret: configService.cloudinary.CLOUDINARY_API_SECRET,
    });
  },
};
 */
