import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { resolve } from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: 'better-sqlite3',
      database: resolve(__dirname, '..', '..', 'data', 'db.sqlite'),
      entities: [
        resolve(__dirname, '..', 'bot', 'entities', '*.entity.{ts,js}'),
      ],
      synchronize: true,
    };
  }
}
