import winston from 'winston';
import { isDevEnvironment } from '../config/config';
import { customLevels, formatter } from './formatter';

class LoggerService {
  private logger: winston.Logger;

  constructor() {
    const prodTransport = new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: formatter
    });

    const transport = new winston.transports.Console({
      format: formatter
    });

    this.logger = winston.createLogger({
      level: isDevEnvironment() ? 'trace' : 'error',
      levels: customLevels.levels,
      transports: [isDevEnvironment() ? transport : prodTransport]
    });

    winston.addColors(customLevels.colors);
  }

  trace(msg: any, meta?: any) {
    this.logger.log('trace', msg, meta);
  }

  debug(msg: any, meta?: any) {
    this.logger.debug(msg, meta);
  }

  info(msg: any, meta?: any) {
    this.logger.info(msg, meta);
  }

  warn(msg: any, meta?: any) {
    this.logger.warn(msg, meta);
  }

  error(msg: any, meta?: any) {
    this.logger.error(msg, meta);
  }

  fatal(msg: any, meta?: any) {
    this.logger.log('fatal', msg, meta);
  }
}

export const logger = new LoggerService();
