import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Admin } from '../auth/admin/entities/admin.entity';
import { User } from '../auth/users/entities/user.entity';

export const databaseConfig = registerAs<TypeOrmModuleOptions>(
  'database',
  () => {
    const config: TypeOrmModuleOptions = {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl:
        process.env.NODE_ENV === 'production'
          ? {
              ca: readFileSync(
                join(__dirname, '..', '..', 'ca-certificate.crt'),
              ),
            }
          : undefined,
      synchronize: false,
      entities: [User, Admin],
    };
    return config;
  },
);
