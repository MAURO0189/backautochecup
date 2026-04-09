import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Admin } from './auth/admin/entities/admin.entity';
import { User } from './auth/users/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from './database/db-config';
import { AdminModule } from './auth/admin/admin.module';
import { UserModule } from './auth/users/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AdminController } from './auth/admin/admin.controller';
import { UserController } from './auth/users/user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Admin]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        config: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        const dbConfig = config.get<TypeOrmModuleOptions>('database');
        if (!dbConfig) {
          throw new Error('Database configuration is missing');
        }
        return dbConfig;
      },
    }),
    AdminModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController, AuthController, AdminController, UserController],
  providers: [AppService],
})
export class AppModule {}
