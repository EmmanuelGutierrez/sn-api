import { registerAs } from '@nestjs/config';

export const config = registerAs('config', () => {
  return {
    database: {
      dbName: process.env.DATABASE_NAME,
      dbPort: process.env.DATABASE_PORT,
      dbUser: process.env.DATABASE_USER,
      dbPass: process.env.DATABASE_PASS,
      dbHost: process.env.DATABASE_HOST,
      dbConnection: process.env.DATABASE_CONNECTION,
    },
    api: {
      apiKey: process.env.API_KEY,
      jwtSecret: process.env.JWT_SECRET,
    },
    cloudinary: {
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    },
    redis: {
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASSWORD,
      port: Number(process.env.REDIS_PORT),
      db: Number(process.env.REDIS_DB),
    },
  };
});
