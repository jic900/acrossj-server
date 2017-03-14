/**
 * Created by E84266 on 3/1/2017.
 */

/**
 * Created by E84266 on 2/24/2017.
 */

'use strict';

var APP_BASE = process.env.NODE_PATH;
var config = require(APP_BASE + '/config');

var express = require('express');
var server = express();

// Set up loggers
var logger = require(APP_BASE + '/utils/logger')(module.filename);
var access_logger = require(APP_BASE + '/utils/access_logger');
var morgan = require('morgan');
server.use(morgan(config.ACCESS_LOG_FORMAT, {stream: access_logger.stream}));

// Check db
var db = require(APP_BASE +'/db/db');
var httpStatus = require('http-status-codes');
var dbCheck = function(req, res, next) {
    if (db.connection.readyState !== 1) {
        var msg = httpStatus.getStatusText(httpStatus.SERVICE_UNAVAILABLE) + ' : Mongo Database';
        res.status(httpStatus.SERVICE_UNAVAILABLE);
        next(new Error(msg));
    } else {
        next();
    }
};
server.use(dbCheck);

// Fix cross domain issue
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
};
server.use(allowCrossDomain);

// Set up request body parser
var body_parser  = require('body-parser');
server.use(body_parser.urlencoded({ extended: true }));
server.use(body_parser.json());

// Define API routes
require(APP_BASE + "/routes/routes")(server);

// Define static resources
var path = require("path");
server.use(express.static(path.join(APP_BASE, 'resources')));

// Error handling
var apiNotImplemented = function(req, res, next) {
    var msg = httpStatus.getStatusText(httpStatus.NOT_IMPLEMENTED) + ' : ' + req.url;
    res.status = httpStatus.NOT_IMPLEMENTED;
    next(new Error(msg));
};
var errHandler = function(err, req, res, next) {
    logger.error(err.stack);
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
    var returnedErr = config.NODE_ENV === 'development' ? err : {};
    res.json({
        message: err.message,
        error: returnedErr
    });
};
server.use(apiNotImplemented);
server.use(errHandler);

//process.send = process.send || function() {};

// Server start and shutdown
server.set('port', config.APP_PORT || 10007);
var http_server = server.listen(server.get('port'), function() {
    logger.debug('ACrossJ server listening on port ' + http_server.address().port);
    process.send('ready');
});

var gracefulShutdown = require('./server_shutdown');
gracefulShutdown(http_server);

var serverShutdown = function() {
    db.close();
    logger.debug('ACrossJ server instance shutting down');
    http_server.shutdown();
    var exitTimer = setTimeout(function() {
        process.exit(0);
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