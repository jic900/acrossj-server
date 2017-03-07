/**
 * Created by E84266 on 2/24/2017.
 */

'use strict';

var APP_BASE = process.cwd();
var config = require(APP_BASE + '/config');
var winston = require('winston');
var pad = require('node-string-pad');

var formatter = function (options) {
    var pid = '[PID-' + pad(process.pid.toString(), 5) + ']';
    var timestamp = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    return timestamp + pid + ' ' + (options.message !== undefined ? options.message : '');
};

var accessLogger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: config.LOG_DIR + '/acrossj-server-access.log',
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
