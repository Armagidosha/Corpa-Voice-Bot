/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */

import { Injectable } from '@nestjs/common';
import {
  WinstonModuleOptionsFactory,
  WinstonModuleOptions,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';

@Injectable()
export class WinstonConfigService implements WinstonModuleOptionsFactory {
  createWinstonModuleOptions(): WinstonModuleOptions {
    return {
      transports: [
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.timestamp({
              format: () => {
                const now = new Date();
                const dd = String(now.getDate()).padStart(2, '0');
                const mm = String(now.getMonth() + 1).padStart(2, '0');
                const yy = String(now.getFullYear()).slice(-2);
                const hh = String(now.getHours()).padStart(2, '0');
                const min = String(now.getMinutes()).padStart(2, '0');
                const ss = String(now.getSeconds()).padStart(2, '0');
                return `${dd}.${mm}.${yy} ${hh}:${min}:${ss}`;
              },
            }),
            winston.format.printf(({ timestamp, level, message, stack }) => {
              if (stack) {
                return `[${timestamp}] ${level.toUpperCase()}:\n${stack}`;
              }
              return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
            }),
          ),
        }),
      ],
    };
  }
}
