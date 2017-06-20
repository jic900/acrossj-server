/**
 * Created by E84266 on 2/24/2017.
 */

'use strict';

const APP_BASE = process.env.NODE_PATH;
const config = require(APP_BASE + '/config');
const winston = require('winston');
const dateFormat = require('dateformat');
const pad = require('node-string-pad');

const formatter = function (options) {
    const pid = '[PID-' + pad(process.pid.toString(), 5) + ']';
    const timestamp = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    return timestamp + pid + ' ' + (options.message !== undefined ? options.message : '');
};

const accessLogger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: config.LOG.DIR + '/acrossj-server-access.log',
            formatter: formatter,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 10
        })
    ]
});

module.exports = accessLogger;
module.exports.stream = {
    write: function(message, encoding) {
        accessLogger.info(message);
    }
};
