/**
 * Created by E84266 on 3/1/2017.
 */

'use strict';

var APP_BASE = process.env.NODE_PATH;
var logger = require(APP_BASE + '/utils/logger')(module.filename);

var http = require('http');
//var https = require('https');

exports = module.exports = gracefulShutdown;

/**
 * Adds shutdown functionality to the `http.Server` object
 * @param {http.Server} server The server to add shutdown functionality to
 */
function gracefulShutdown(server) {
    var connections = {};
    var isShuttingDown = false;
    var connectionCounter = 0;

    function destroy(socket, force) {
        if (force || (socket._isIdle && isShuttingDown)) {
            socket.destroy();
            delete connections[socket._connectionId];
        }
    };

    function onConnection(socket) {
        var id = connectionCounter++;
        socket._isIdle = true;
        socket._connectionId = id;
        connections[id] = socket;

        socket.on('close', function() {
            delete connections[id];
        });
        socket.on('error', function() {
            delete connections[id];
        });
    };

    server.on('request', function(req, res) {
        req.socket._isIdle = false;

        res.on('finish', function() {
            req.socket._isIdle = true;
            destroy(req.socket);
        });
    });

    server.on('connection', onConnection);
//    server.on('secureConnection', onConnection);

    // server.on('error', function(err, callback) {
    //     logger.error('HTTP server error occurred: ' + err.stack);
    //     if (callback) {
    //         process.nextTick(function() {
    //             callback(err);
    //         });
    //     }
    // });

    function shutdown(force, callback) {
        logger.debug('HTTP server closing');
        isShuttingDown = true;

        server.close(function(err) {
            if (callback) {
                process.nextTick(function() {
                    callback(err);
                });
            }
        });
        Object.keys(connections).forEach(function(key) {
            destroy(connections[key], force);
        });
    };

    server.shutdown = function(callback) {
        shutdown(false, callback);
    };

    server.forceShutdown = function(callback) {
        shutdown(true, callback);
    };

    return server;
};

/**
 * Extends the {http.Server} object with shutdown functionality.
 * @return {http.Server} The decorated server object
 */
exports.extend = function() {
    http.Server.prototype.withShutdown = function() {
        return gracefulShutdown(this);
    };

    // https.Server.prototype.withShutdown = function() {
    //     return gracefulShutdown(this);
    // };
};