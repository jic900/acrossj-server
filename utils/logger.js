/**
 * Created by E84266 on 2/24/2017.
 */

'use strict';

module.exports = function (callingModule) {

  const APP_BASE = process.env.NODE_PATH;
  const config = require(APP_BASE + '/config');
  const winston = require('winston');
  const fs = require('fs');
  const dateFormat = require('dateformat');
  const pad = require('node-string-pad');

  fs.existsSync(config.LOG.DIR) || fs.mkdirSync(config.LOG.DIR);

  const getCallerName = function (caller) {
    const delimiter = process.platform === 'linux' ? '/' : '\\';
    let parts = caller.split(delimiter);
    return parts[parts.length - 2] + '/' + parts.pop();
  };

  const formatter = function (options) {
    const paddedLevel = pad(options.level.toUpperCase(), 5);
    const level = !options.colorize ? '[' + paddedLevel + ']' : '[' + winston.config.colorize(options.level, paddedLevel) + ']';
    const pid = '[PID-' + pad(process.pid.toString(), 5) + ']';
    const callerName = '[' + getCallerName(callingModule) + ']';
    const timestamp = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:l");
    return timestamp + level + pid + callerName + ' ' + (options.message !== undefined ? options.message : '');
  };

  const transportConsole = new winston.transports.Console({
      level: config.LOG.CONSOLE_LEVEL,
      prettyPrint: true,
      json: false,
      colorize: true,
      stderrLevels: ['error'],
      formatter: formatter
    }),
    transportFile = new winston.transports.File({
      level: config.LOG.FILE_LEVEL,
      filename: config.LOG.DIR + '/acrossj-server.log',
      prettyPrint: true,
      json: false,
      formatter: formatter,
      maxsize: 5242880, //5MB
      maxFiles: 10
    }),
    transportErrorFile = new winston.transports.File({
      filename: config.LOG.DIR + '/acrossj-server-errors.log',
      prettyPrint: true,
      json: false,
      formatter: formatter,
      maxsize: 5242880, //5MB
      maxFiles: 10
    });

  winston.addColors({
    fatal: ['red', 'bold'],
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    debug: 'green',
    trace: 'cyan'
  });

  const logger = new (winston.Logger)({
    levels: {
      fatal: 0,
      error: 1,
      warn: 2,
      info: 3,
      debug: 4,
      trace: 5
    },
    transports: [
      transportConsole,
      transportFile
    ],
    exceptionHandlers: [
      transportConsole,
      transportErrorFile
    ],
    exitOnError: false
  });

  return logger;
};
