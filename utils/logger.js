/**
 * Created by E84266 on 2/24/2017.
 */

'use strict';

module.exports = function(callingModule) {

    var APP_BASE = process.cwd();
    var config = require(APP_BASE + '/config');
    var winston = require('winston');
    var fs = require('fs');
    var dateFormat = require('dateformat');
    var pad = require('node-string-pad');

    fs.existsSync(config.LOG_DIR) || fs.mkdirSync(config.LOG_DIR);

    var getCallerName = function(caller) {
        var parts = caller.split('\\');
        return parts[parts.length - 2] + '/' + parts.pop();
    };

    var formatter = function (options) {
        var paddedLevel = pad(options.level.toUpperCase(), 5);
        var level = !options.colorize ? '[' + paddedLevel + ']' : '[' + winston.config.colorize(options.level, paddedLevel) + ']';
        var pid = '[PID-' + pad(process.pid.toString(), 5) + ']';
        var callerName = '[' + getCallerName(callingModule) + ']';
        var timestamp = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
        return timestamp + level + pid + callerName + ' ' + (options.message !== undefined ? options.message : '');
    };

    var transportConsole = new winston.transports.Console({
            level: config.LOG_CONSOLE_LEVEL,
            prettyPrint: true,
            json: false,
            colorize: true,
            formatter: formatter
        }),
        transportFile = new winston.transports.File({
            level: config.LOG_FILE_LEVEL,
            filename: config.LOG_DIR + '/acrossj-server.log',
            prettyPrint: true,
            json: false,
            formatter: formatter,
            maxsize: 5242880, //5MB
            maxFiles: 10
        }),
        transportErrorFile = new winston.transports.File({
            filename: config.LOG_DIR + '/acrossj-server-errors.log',
            prettyPrint: true,
            json:false,
            formatter: formatter,
            maxsize: 5242880, //5MB
            maxFiles: 10
        });

    winston.addColors({
        fatal: ['red','bold'],
        error: 'red',
        warn: 'yellow',
        info: 'blue',
        debug: 'green',
        trace: 'cyan'
    });

    var logger = new(winston.Logger)({
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
