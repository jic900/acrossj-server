/**
 * Created by E84266 on 2/24/2017.
 */

'use strict';

var APP_BASE = process.cwd();
var config = require(APP_BASE + '/config');
var logger = require(APP_BASE + '/utils/logger')(module.filename);
logger.debug('Initializing auth');

var jwt = require('jsonwebtoken');
var User = require(APP_BASE + '/models/user');

module.exports = function (req, res, next) {
    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) {
            next(err);
        } else if ( !user ) {
            var httpStatus = require('http-status-codes');
            var msg = httpStatus.getStatusText(httpStatus.UNAUTHORIZED) + ' : User not found.'
            res.status(httpStatus.UNAUTHORIZED);
            next(new Error(msg));
        } else {
            user.comparePassword(req.body.password, function (err, matched) {
                if (err) {
                    next(err);
                } else if ( !matched ) {
                    var msg = httpStatus.getStatusText(httpStatus.UNAUTHORIZED) + ' : Invalid password.'
                    res.status(httpStatus.UNAUTHORIZED);
                    next(new Error(msg));
                } else {
                    var token = jwt.sign(user, config.JWT_SECRET, {
                        expiresInMinutes: config.JWT_EXPIRE
                    });
                    res.json({
                        message: 'Login Successful',
                        token: token
                    });
                }
            })
        }
    });
};
