/**
 * Created by E84266 on 2/24/2017.
 */

'use strict';

process.env.NODE_PATH = __dirname;
const APP_BASE = process.env.NODE_PATH;
const config = require(APP_BASE + '/config');
const logger = require(APP_BASE + '/utils/logger')(module.filename);

const cluster = require('cluster');
const cpuCount = config.NODE_ENV !== 'development' ? require('os').cpus().length : 1;

const pm2Enabled = function() {
    const fs = require('fs');
    return fs.existsSync(config.PM2_CONFIG_FILE);
}

const pm2ExecMode = function() {
    if (pm2Enabled()) {
        const pm2Config = require(config.PM2_CONFIG_FILE);
        return pm2Config.apps[0].exec_mode;
    }
    return undefined;
};

if (pm2ExecMode() === 'cluster') {
    logger.info('PM2 cluster mode enabled. Starting acrossj server instance.');
    require(APP_BASE + '/server/server');
} else {
    if (cluster.isMaster) {
        logger.info('PM2 cluster mode disabled. Starting node cluster.');
        for (let i = 0; i < cpuCount; i += 1) {
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
