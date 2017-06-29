/**
 * Created by E84266 on 3/1/2017.
 */
'use strict';

const APP_BASE = process.env.NODE_PATH;
const config = require(APP_BASE + '/config');
const errors = require(APP_BASE + '/resources/errors');

require('events').EventEmitter.defaultMaxListeners = 100;

const express = require('express');
const server = express();

// Set up loggers
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const access_logger = require(APP_BASE + '/utils/access_logger');
const morgan = require('morgan');
server.use(morgan(config.LOG.ACCESS_LOG_FORMAT, {stream: access_logger.stream}));

// Check db
const db = require(APP_BASE +'/db/db').db;
const httpStatus = require('http-status-codes');
const dbCheck = function(req, res, next) {
    if (db.readyState !== 1) {
        const error = {
            status: httpStatus.SERVICE_UNAVAILABLE,
            error: {
                name: 'DBUnavailable',
                message: errors.get('common.db.unavailable')
            }
        };
        next(error);
    } else {
        next();
    }
};
server.use(dbCheck);

// Fix cross domain issue
const allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
};
server.use(allowCrossDomain);

// Set up request body parser
const body_parser = require('body-parser');
server.use(body_parser.urlencoded({extended: true}));
server.use(body_parser.json());

// Handle browser built-in favicon request
const favicon = require('serve-favicon');
server.use(favicon(APP_BASE + '/static/images/favicon.ico'));

// Define routes
server.use(require(APP_BASE + "/routes"));

// Define static resources
const path = require("path");
server.use(express.static(path.join(APP_BASE, 'static')));

const apiNotImplemented = function(req, res, next) {
    const error = {
        status: httpStatus.NOT_IMPLEMENTED,
        error: {
            name: 'APINotImplemented',
            message: errors.get('common.api.not.implemented', [req.method, req.url])
        }
    }
    next(error);
};

const errHandler = function(err, req, res, next) {
    if (err.error.stack) {
        logger.error(err.error.stack);
    } else {
        logger.error(err.error.message);
    }
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
    const nodeEnv = process.env.NODE_ENV || config.NODE_ENV;
    if (nodeEnv === 'production') {
        err.error = {};
    }
    res.json(err);
};
server.use(apiNotImplemented);
server.use(errHandler);

//process.send = process.send || function() {};

server.set('port', config.SERVER.PORT || 10007);
const http_server = server.listen(server.get('port'), function() {
    logger.debug('ACrossJ server listening on port ' + http_server.address().port);
    process.send('ready');
});

const gracefulShutdown = require('./server_shutdown');
gracefulShutdown(http_server);

const serverShutdown = function() {
    db.close(function() {});
    logger.debug('ACrossJ server instance shutting down');
    http_server.shutdown();
    const exitTimer = setTimeout(function(err) {
        process.exit(err ? 1 : 0);
    }, 5000);
    exitTimer.unref();
};

// Gracefully shut down server when the Node process ends
process.on('SIGINT', function() {
    serverShutdown();
});

process.on('message', function(msg) {
    if (msg == 'shutdown') {
        serverShutdown();
    }
});