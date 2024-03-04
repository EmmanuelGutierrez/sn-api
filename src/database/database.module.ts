import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from '../common/config/config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigType<typeof config>) => {
        const { database } = configService;
        const dbUrl = `${database.dbHost}://${database.dbUser}:${database.dbPass}@${database.dbConnection}.mongodb.net/?retryWrites=true&w=majority`;
        return {
          uri: dbUrl,
          dbName: database.dbName,
        };
      },
      inject: [config.KEY],
    }),
  ],
})
export class DatabaseModule {}
