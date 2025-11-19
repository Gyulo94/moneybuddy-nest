import { formatInTimeZone } from 'date-fns-tz';
import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

const env = process.env.NODE_ENV;
const APP_NAME = process.env.APP_NAME;
const PROJECT_NAME = process.env.PROJECT_NAME;

const apeendTimestamp = winston.format((info, opts: { tz: string }) => {
  if (opts.tz) {
    info.timestamp = formatInTimeZone(
      new Date(),
      opts.tz,
      'yyyy-MM-dd HH:mm:ss',
    );
  }
  return info;
});

const dailyOptions = {
  level: 'http',
  datePattern: 'YYYY-MM-DD',
  dirname: __dirname + '/../../../logs',
  filename: `${PROJECT_NAME}.log.%DATE%`,
  maxFiles: 30,
  zippedArchive: true,
  colorize: false,
  json: false,
};

export const winstonLogger = WinstonModule.createLogger({
  format: winston.format.combine(
    apeendTimestamp({ tz: 'Asia/Seoul' }),
    winston.format.json(),
    env !== 'production'
      ? winston.format.colorize({ all: true })
      : winston.format.uncolorize(),
    winston.format.printf((info) => {
      const stack =
        info.stack || info.trace ? `\n${info.stack || info.trace}` : '';
      return `${info.timestamp} - ${info.level} [${process.pid}] [${info.context || APP_NAME}] : ${info.message}${stack}`;
    }),
  ),
  transports: [
    new winston.transports.Console({
      level: env === 'production' ? 'info' : 'silly',
      format:
        env === 'production'
          ? winston.format.simple()
          : winston.format.combine(
              winston.format.timestamp(),
              utilities.format.nestLike(process.env.APP_NAME, {
                prettyPrint: true,
              }),
            ),
      handleExceptions: true,
      handleRejections: true,
    }),
    new winstonDaily(dailyOptions),
  ],
});
