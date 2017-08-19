/*
** Log levels:
** error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5
*/

const winston = require('winston');

const logLevel = process.env.LOG_LEVEL || 'debug';
winston.level = logLevel;

const transports = [
  new (winston.transports.Console)({
    timestamp: true,
    colorize: true
  }),

  new (winston.transports.File)({
    filename: 'logs/main.log',
    timestamp: true,
    prepend: true,
    maxsize: 10485760, // 10MB
    maxFiles: 10
  })
];

const logger = new (winston.Logger)({ transports });
winston.info('Log level:' + logLevel);

module.exports = logger;
