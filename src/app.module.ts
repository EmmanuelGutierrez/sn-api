import { Module } from '@nestjs/common';
import { config } from './common/config/config';
import { join } from 'path';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, 'common/envs/dev.env'),
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        API_KEY: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_USER: Joi.optional(),
        DATABASE_PASS: Joi.optional(),
        DATABASE_CONNECTION: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        'es-*': 'es',
        'en-*': 'en',
      },
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
      typesOutputPath: join(
        __dirname,
        '../src/common/models/i18n.generated.ts',
      ),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req, res }) => ({ req, res }),
    }),
    DatabaseModule,
    PostModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
