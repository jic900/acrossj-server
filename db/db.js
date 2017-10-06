/**
 * Created by E84266 on 2/24/2017.
 */

'use strict';

const APP_BASE = process.env.NODE_PATH;
const config = require(APP_BASE + '/config');
const logger = require(APP_BASE + '/utils/logger')(module.filename);
const mongoose = require('mongoose');

const connectOptions = {
  useMongoClient: true,
  keepAlive: true,
  reconnectTries: 3
}

mongoose.connect(config.DB.URL, connectOptions);

const connection = mongoose.connection;

connection.on('connecting', function () {
  logger.info('Mongoose connecting to ' + config.DB.URL);
});

connection.on('connected', function () {
  logger.info('Mongoose connection open to ' + config.DB.URL);
});

connection.on('error', function (err) {
  logger.error('Mongoose connection error: ' + err);
});

connection.on('disconnected', function () {
  logger.info('Mongoose connection disconnected');
});

const uniqueValidator = require('mongoose-unique-validator');
const autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(connection);

exports.db = connection;
exports.uniqueValidator = uniqueValidator;
exports.autoIncrement = autoIncrement;
