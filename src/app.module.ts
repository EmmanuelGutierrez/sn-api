import { Module, UnauthorizedException } from '@nestjs/common';
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
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { FileModule } from './modules/file/file.module';
import { RedisPubSubModule } from './modules/redis-pub-sub/redis-pub-sub.module';
import { AuthService } from './modules/auth/auth.service';
import { contextGraphqlWs } from './common/models/context-graphql-ws';
import { ToLowerCaseKeys } from './common/utils/ToLowerCaseKeys';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, 'common/envs/dev.env'),
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        API_KEY: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_USER: Joi.optional(),
        DATABASE_PASS: Joi.optional(),
        DATABASE_CONNECTION: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_DB: Joi.number().required(),
        REDIS_PASSWORD: Joi.string(),
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
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [AuthService],
      useFactory: async (authService: AuthService) => {
        return {
          subscriptions: {
            'graphql-ws': {
              onConnect: (ctx: contextGraphqlWs) => {
                const { extra, connectionParams } = ctx;
                const AuthorizationObj: { authorization?: string } =
                  ToLowerCaseKeys(connectionParams);
                if (!AuthorizationObj.authorization) {
                  throw new UnauthorizedException('No auth');
                }
                const user = authService.decodeToken(
                  connectionParams.Authorization as string,
                );
                if (!user) {
                  throw new UnauthorizedException('No user');
                }
                extra.user = user;
                // jwtService.decode(ctx.connectionParams.Authorization as string);
              },
            },
          },
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          playground: false,
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          installSubscriptionHandlers: true,
          context: ({ req, res, extra }) => {
            // console.log('req', req);
            return { req, res, extra };
          },
        };
      },
    }),
    DatabaseModule,
    PostModule,
    UserModule,
    AuthModule,
    CloudinaryModule,
    FileModule,
    RedisPubSubModule,
  ],
  controllers: [],
})
export class AppModule {}
