import { v2 } from 'cloudinary';
import { Inject, Injectable } from '@nestjs/common';
import { config } from '../../common/config/config';
import { ConfigType } from '@nestjs/config';
import { CLOUDINARY } from 'src/common/constants/constants';

/* @Injectable()
export class CloudinaryServiceProvider {
  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {
    this.cloudinary.config({
      cloud_name: '',
      api_key: '',
      api_secret: '',
    });
  }

  cloudinary = v2;
}
 */

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: '',
      api_key: '',
      api_secret: '',
    });
  },
};
