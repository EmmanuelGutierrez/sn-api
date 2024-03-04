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
  };
});
