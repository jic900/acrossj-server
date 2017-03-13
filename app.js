/**
 * Created by E84266 on 2/24/2017.
 */

'use strict';

process.env.NODE_PATH = __dirname;
var APP_BASE = process.env.NODE_PATH;
var config = require(APP_BASE + '/config');
var logger = require(APP_BASE + '/utils/logger')(module.filename);

var cluster = require('cluster');
var cpuCount = config.NODE_ENV !== 'development' ? require('os').cpus().length : 1;

var pm2Enabled = function() {
    var fs = require('fs');
    return fs.existsSync(config.PM2_CONFIG_FILE);
}

var pm2ExecMode = function() {
    if (pm2Enabled()) {
        var pm2Config = require(config.PM2_CONFIG_FILE);
        return pm2Config.apps[0].exec_mode;
    }
    return undefined;
};

if (pm2ExecMode() === 'cluster') {
    logger.info('PM2 cluster mode enabled. Starting acrossj server.');
    require(APP_BASE + '/server/server');
} else {
    if (cluster.isMaster) {
        logger.info('PM2 cluster mode disabled. Starting node cluster.');
        for (var i = 0; i < cpuCount; i += 1) {
            cluster.fork();
        }
        cluster.on('exit', function(server) {
            logger.info('Server ' + server.id + ' died, restoring');
            cluster.fork();
        });
    } else {
        require(APP_BASE + '/server/server');
    }
}
