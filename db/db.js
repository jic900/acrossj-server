/**
 * Created by E84266 on 2/24/2017.
 */

'use strict';


var APP_BASE = process.cwd()
var config = require(APP_BASE + '/config');
var logger = require(APP_BASE + '/utils/logger')(module.filename);
var mongoose = require('mongoose');

var connectOptions = {
    server:{
        socketOptions:{
//            connectTimeoutMS: 15000,
//            socketTimeoutMS: 15000,
            keepAlive: 1
        }
    }
}

mongoose.connect(config.DB_URL, connectOptions);

mongoose.connection.on('connecting', function () {
    logger.info('Mongoose connecting to ' + config.DB_URL);
});

mongoose.connection.on('connected', function () {
    logger.info('Mongoose connection open to ' + config.DB_URL);
});

mongoose.connection.on('error',function (err) {
    logger.error('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    logger.info('Mongoose connection disconnected');
});

var fs = require('fs');
fs.readdirSync(APP_BASE + '/models').forEach(function(name){
    var model = name.substring(0, name.indexOf('.'));
    require(APP_BASE + '/models/' + model);
});

module.exports = mongoose;

module.exports.close = function() {
    mongoose.connection.close(function() {});
}